from pydantic import BaseModel  # type: ignore
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    stock: int
    image_url: Optional[str] = None
    category: Optional[str] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    stock: int
    image_url: str = "https://placehold.co/400x400/e8e8e8/666666?text=Product+Image"


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
