from typing import Dict, Any

# Mock behavior score fetcher
def get_mock_behavior_score(user_id: int) -> float:
    # Scale 0.0 (safe) to 1.0 (anomalous)
    return 0.2

def verify_transaction_intent(amount: float, receiver: str, knows_person: bool, urgency_flag: bool, user_id: int) -> Dict[str, Any]:
    HIGH_AMOUNT_THRESHOLD = 10000.0  # ₹10,000
    
    score = 0
    reasons = []
    
    behavior_anomaly_score = get_mock_behavior_score(user_id)
    
    # Simple logic
    is_high_amount = amount >= HIGH_AMOUNT_THRESHOLD
    # In a real app we'd query transactions for receiver count, mocking "new receiver" check here based on string matching "New"
    # Actually, we don't have db access in the prompt request for receiver, so we assume "new" is true if `knows_person` is false
    # Or just use the rule: High amount + doesn't know person = high risk
    
    if is_high_amount and not knows_person:
        score += 50
        reasons.append(f"High amount (₹{amount}) to an unknown receiver.")
        
    if urgency_flag:
        score += 30
        reasons.append("Urgent transaction context detected.")
        
    if not knows_person:
        score += 10
        reasons.append("Receiver is not known personally.")
        
    if behavior_anomaly_score > 0.5:
        score += 20
        reasons.append("Anomalous behavior profile detected.")

    decision = "allow"
    explanation = "Transaction seems safe and verified."
    
    if score >= 80:
        decision = "block"
        explanation = "CRITICAL RISK: " + " ".join(reasons)
    elif score >= 30:
        decision = "warn"
        explanation = "SUSPICIOUS ACTIVITY: " + " ".join(reasons)
        
    return {
        "decision": decision,
        "explanation": explanation
    }
