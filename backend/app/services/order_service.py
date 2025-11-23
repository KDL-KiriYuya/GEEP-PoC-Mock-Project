# flake8: noqa: E501
from typing import Optional, Any
from sqlalchemy.orm import Session  # type: ignore
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse, OrderItemCreate
from app.services.payment_service import PaymentService


class OrderService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.payment_service = PaymentService()

    def validate_order_items(self, items: list[OrderItemCreate]) -> Optional[str]:
        """
        Validate order items.
        BUG-BE-001: Intentionally omits stock check - orders succeed even when stock is zero.
        Returns error message if validation fails, None if valid.
        """
        for item in items:
            # Check if product exists
            product = self.db.query(Product).filter(Product.id == item.product_id).first()

            if not product:
                return f"Product with ID {item.product_id} not found"

            # Check quantity is positive
            if item.quantity <= 0:
                return f"Invalid quantity for product ID {item.product_id}"

            # BUG-BE-001: Intentionally omit stock check
            # This should check: if product.stock < item.quantity
            # But we're leaving it out to create the bug

        return None

    def create_order(self, order_data: OrderCreate) -> OrderResponse:
        """
        Create a new order with transaction handling.
        Validates items, processes payment, and saves order to database.
        """
        # Validate order items
        validation_error = self.validate_order_items(order_data.items)
        if validation_error:
            raise ValueError(validation_error)

        # Calculate total amount
        total_amount = 0
        order_items_data = []

        for item in order_data.items:
            product = self.db.query(Product).filter(Product.id == item.product_id).first()

            item_total = product.price * item.quantity
            total_amount += item_total

            order_items_data.append({"product_id": item.product_id, "quantity": item.quantity, "unit_price": product.price})

        # Process payment
        payment_result = self.payment_service.process_payment(total_amount)

        if payment_result["status"] != "authorized":
            raise ValueError("Payment processing failed")

        # Create order in transaction
        try:
            # Create order
            order = Order(user_id=order_data.user_id, total_amount=total_amount, status="paid")
            self.db.add(order)
            self.db.flush()  # Get order ID

            # Create order items
            for item_data in order_items_data:
                order_item = OrderItem(order_id=order.id, **item_data)
                self.db.add(order_item)

            # Commit transaction
            self.db.commit()
            self.db.refresh(order)

            return OrderResponse.model_validate(order)

        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Failed to create order: {str(e)}")

    def get_user_orders(self, user_id: str) -> list[OrderResponse]:
        """
        Get all orders for a specific user.
        Returns list of orders with items, ordered by creation date (newest first).
        """
        orders = self.db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()

        return [OrderResponse.model_validate(order) for order in orders]
