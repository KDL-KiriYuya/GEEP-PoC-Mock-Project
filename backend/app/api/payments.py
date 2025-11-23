from fastapi import APIRouter  # type: ignore
from pydantic import BaseModel  # type: ignore
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/api/payments", tags=["payments"])


class CheckoutRequest(BaseModel):
    amount: int


class CheckoutResponse(BaseModel):
    status: str
    transaction_id: str


@router.post("/checkout", response_model=CheckoutResponse)
def checkout(request: CheckoutRequest) -> CheckoutResponse:
    """
    Process payment checkout (dummy implementation).
    Always returns success with a dummy transaction ID.
    """
    payment_service = PaymentService()
    result = payment_service.process_payment(request.amount)

    return CheckoutResponse(status=result["status"], transaction_id=result["transaction_id"])
