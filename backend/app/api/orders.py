from typing import List
from fastapi import APIRouter, Depends, HTTPException  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.services.order_service import OrderService
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("", response_model=OrderResponse)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)) -> OrderResponse:
    """
    Create a new order.
    Validates items, processes payment, and saves order to database.
    Returns 400 if validation fails or stock is insufficient.
    """
    service = OrderService(db)

    try:
        order = service.create_order(order_data)
        return order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/history", response_model=List[OrderResponse])
def get_order_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[OrderResponse]:
    """
    Get order history for the current user.
    Returns list of orders with items.
    """
    service = OrderService(db)
    return service.get_user_orders(current_user.username)
