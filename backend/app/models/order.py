from sqlalchemy import Column, Integer, String, DateTime  # type: ignore
from sqlalchemy.orm import relationship  # type: ignore
from datetime import datetime
from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)
    total_amount = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )
