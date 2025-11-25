# flake8: noqa: E501
from sqlalchemy.orm import Session  # type: ignore
from app.models.product import Product
from app.schemas.product import ProductListResponse, ProductResponse, ProductCreate, ProductUpdate
from typing import Optional


class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_products(self, page: int = 1, page_size: int = 20, search_query: Optional[str] = None) -> ProductListResponse:
        """
        Retrieve paginated products.
        BUG-BE-004: Products with stock=0 are displayed in the list (should filter them out)
        """
        # Fixed: Correct offset calculation
        offset = (page - 1) * page_size

        query = self.db.query(Product)

        if search_query:
            query = query.filter(Product.name.ilike(f"%{search_query}%"))

        # BUG-BE-004: Missing filter for out-of-stock products
        # Should add: query = query.filter(Product.stock > 0)

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

    def create_product(self, product_data: ProductCreate) -> ProductResponse:
        """
        Create a new product.
        """
        product = Product(
            name=product_data.name,
            description=product_data.description,
            price=product_data.price,
            stock=product_data.stock,
            image_url=product_data.image_url,
        )
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return ProductResponse.model_validate(product)

    def update_product(self, product_id: int, product_data: ProductUpdate) -> Optional[ProductResponse]:
        """
        Update an existing product.
        Returns None if product not found.
        """
        product = self.db.query(Product).filter(Product.id == product_id).first()

        if not product:
            return None

        if product_data.name is not None:
            product.name = product_data.name
        if product_data.description is not None:
            product.description = product_data.description
        if product_data.price is not None:
            product.price = product_data.price
        if product_data.stock is not None:
            product.stock = product_data.stock
        if product_data.image_url is not None:
            product.image_url = product_data.image_url

        self.db.commit()
        self.db.refresh(product)
        return ProductResponse.model_validate(product)

    def delete_product(self, product_id: int) -> bool:
        """
        Delete a product.
        Returns True if deleted, False if not found.
        """
        product = self.db.query(Product).filter(Product.id == product_id).first()

        if not product:
            return False

        self.db.delete(product)
        self.db.commit()
        return True
