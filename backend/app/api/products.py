from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.db.session import get_db
from app.services.product_service import ProductService
from app.schemas.product import ProductListResponse, ProductResponse

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
