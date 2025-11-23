# flake8: noqa: E501
from sqlalchemy.orm import Session  # type: ignore
from app.models.product import Product
from app.schemas.product import ProductListResponse, ProductResponse
from typing import Optional


class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_products(self, page: int = 1, page_size: int = 20, search_query: Optional[str] = None) -> ProductListResponse:
        """
        Retrieve paginated products.
        BUG-BE-002: Intentionally incorrect offset calculation (off by one page)
        """
        # Intentional bug: offset calculation is incorrect
        offset = page * page_size  # Should be (page - 1) * page_size

        query = self.db.query(Product)

        if search_query:
            query = query.filter(Product.name.ilike(f"%{search_query}%"))

        total = query.count()
        products = query.offset(offset).limit(page_size).all()

        return ProductListResponse(items=[ProductResponse.model_validate(p) for p in products], total=total, page=page, page_size=page_size)

    def get_product_by_id(self, product_id: int) -> Optional[ProductResponse]:
        """
        Retrieve a single product by ID with error handling.
        Returns None if product not found.
        """
        product = self.db.query(Product).filter(Product.id == product_id).first()

        if not product:
            return None

        return ProductResponse.model_validate(product)

    def check_stock(self, product_id: int, quantity: int) -> bool:
        """
        Check if sufficient stock is available for a product.
        Returns True if stock is sufficient, False otherwise.
        """
        product = self.db.query(Product).filter(Product.id == product_id).first()

        if not product:
            return False

        return product.stock >= quantity
