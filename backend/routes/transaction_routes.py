from fastapi import APIRouter, Depends, HTTPException
from .. import schemas, database, auth
from ..ml.intent_engine import verify_transaction_intent
from ..utils.alert_utils import create_user_alert
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/transaction", tags=["Transactions"])

@router.post("/initiate", response_model=schemas.TransactionInitiateResponse)
def initiate_transaction(request: schemas.TransactionInitiateRequest, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    result = verify_transaction_intent(
        amount=request.amount,
        receiver=request.receiver,
        knows_person=request.answers.knows_person,
        urgency_flag=request.answers.urgency_flag,
        user_id=request.user_id
    )
    
    if result["decision"] == "block":
        create_user_alert(db, request.user_id, f"Transaction Blocked: {result['explanation']}", "high")
    elif result["decision"] == "warn":
        create_user_alert(db, request.user_id, f"Suspicious Transaction Warned: {result['explanation']}", "medium")
    
    return schemas.TransactionInitiateResponse(
        decision=result["decision"],
        explanation=result["explanation"]
    )
