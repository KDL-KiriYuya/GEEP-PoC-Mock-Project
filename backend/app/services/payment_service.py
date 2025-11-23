import uuid
from typing import Dict


class PaymentService:
    def process_payment(self, amount: int) -> Dict[str, str]:
        """
        Dummy payment processing that always returns success.
        Returns a dictionary with status and transaction_id.
        """
        # Generate a dummy transaction ID
        transaction_id = f"dummy-{uuid.uuid4()}"
        
        return {
            "status": "authorized",
            "transaction_id": transaction_id
        }
