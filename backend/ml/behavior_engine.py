import datetime
from sqlalchemy.orm import Session
from .. import models

def analyze_user_behavior(user_id: int, db: Session) -> dict:
    """
    Analyzes historical transactions of a user and determines anomalous behavior.
    Uses rule-based logic for speed and full explainability.
    """
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).order_by(models.Transaction.timestamp.desc()).all()
    
    anomaly_score = 0.0
    is_anomalous = False

    if not transactions:
        # No history, slightly risky but not anomalous per se
        return {"anomaly_score": 0.1, "is_anomalous": False}
        
    latest_txn = transactions[0]
    
    # Rule 1: Time of transaction
    # Let's say night time (12 AM to 5 AM) is unusual
    hour = latest_txn.timestamp.hour
    if 0 <= hour <= 5:
        anomaly_score += 0.4
        
    # Rule 2: Amount anomaly (> 3x average)
    if len(transactions) > 1:
        past_txns = transactions[1:]  # Exclude latest to get past average
        avg_amount = sum(t.amount for t in past_txns) / len(past_txns)
        
        # Prevent division by zero if avg is 0
        if avg_amount > 0 and latest_txn.amount > (avg_amount * 3):
            anomaly_score += 0.5
            
    # Normalize score to max 1.0
    anomaly_score = min(anomaly_score, 1.0)
    
    if anomaly_score >= 0.5:
        is_anomalous = True

    return {
        "anomaly_score": round(anomaly_score, 2),
        "is_anomalous": is_anomalous
    }
