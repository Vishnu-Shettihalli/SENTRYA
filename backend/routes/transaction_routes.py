from fastapi import APIRouter, Depends, HTTPException
from .. import schemas, database, auth
from ..utils.gemini_client import verify_intent_with_ai
from ..utils.alert_utils import create_user_alert
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/transaction", tags=["Transactions"])

@router.post("/initiate", response_model=schemas.TransactionInitiateResponse)
def initiate_transaction(request: schemas.TransactionInitiateRequest, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    answers_list = []
    if request.answers.knows_person: answers_list.append("I know them personally")
    else: answers_list.append("I don't know them")
    
    if request.answers.urgency_flag: answers_list.append("Someone asked me on a call")
    else: answers_list.append("No one asked me on a call")

    result = verify_intent_with_ai(
        amount=request.amount,
        receiver=request.receiver,
        answers=answers_list
    )
    
    if result.get("decision") == "block":
        create_user_alert(db, request.user_id, f"Transaction Blocked: {result.get('explanation', 'Unknown threat')}", "high")
    elif result.get("decision") == "warn":
        create_user_alert(db, request.user_id, f"Suspicious Transaction Warned: {result.get('explanation', 'Unknown threat')}", "medium")
    
    return schemas.TransactionInitiateResponse(
        decision=result.get("decision", "allow"),
        explanation=result.get("explanation", "Transaction processed safely.")
    )
