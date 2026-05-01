import re
from typing import Dict, Any, List

# Rule-based dictionary for financial keywords and urgency
KEYWORDS_FINANCIAL = ["otp", "kyc", "bank", "account", "cvv", "pin", "verify", "password", "upi"]
KEYWORDS_URGENCY = ["urgent", "blocked", "suspended", "expire", "immediately", "action required", "alert"]

def extract_keywords(text: str, keyword_list: List[str]) -> List[str]:
    found = []
    text_lower = text.lower()
    for kw in keyword_list:
        if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
            found.append(kw)
    return found

def analyze_text(text: str) -> Dict[str, Any]:
    found_financial = extract_keywords(text, KEYWORDS_FINANCIAL)
    found_urgency = extract_keywords(text, KEYWORDS_URGENCY)
    
    all_keywords = found_financial + found_urgency
    
    score = (len(found_financial) * 2) + (len(found_urgency) * 3)
    
    risk_level = "low"
    explanation = "This message appears safe with no immediate signs of a scam."
    
    if score >= 5:
        risk_level = "high"
        explanation = "This message contains urgent language and requests sensitive financial information, highly likely to be a scam."
    elif score > 0:
        risk_level = "medium"
        explanation = "This message asks for or mentions financial details or urgency. Please proceed with caution."
        
    return {
        "risk_level": risk_level,
        "detected_keywords": all_keywords,
        "explanation": explanation
    }
