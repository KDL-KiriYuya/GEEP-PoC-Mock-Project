from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.db.session import get_db
from app.services.product_service import ProductService
from app.schemas.product import ProductListResponse, ProductResponse, ProductCreate, ProductUpdate
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
def get_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
) -> ProductListResponse:
    """
    Get paginated list of products.
    """
    service = ProductService(db)
    return service.get_products(page=page, page_size=page_size, search_query=q)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)) -> ProductResponse:
    """
    Get a single product by ID.
    Returns 404 if product not found.
    """
    service = ProductService(db)
    product = service.get_product_by_id(product_id)

    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")

    return product


@router.post("", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProductResponse:
    """
    Create a new product (admin only).
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to create products")

    service = ProductService(db)
    return service.create_product(product_data)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProductResponse:
    """
    Update a product (admin only).
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to update products")

    service = ProductService(db)
    product = service.update_product(product_id, product_data)

    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")

    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a product (admin only).
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to delete products")

    service = ProductService(db)
    success = service.delete_product(product_id)

    if not success:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")

    return {"message": "Product deleted successfully"}
