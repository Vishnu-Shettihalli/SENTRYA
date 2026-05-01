import os
import requests
import json

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

def get_gemini_api_key():
    return os.getenv("GEMINI_API_KEY", "")

def analyze_scam_with_ai(content: str) -> dict:
    api_key = get_gemini_api_key()
    if not api_key:
        return {"risk_level": "high", "explanation": "API Key missing. Cannot verify. Assume high risk.", "detected_keywords": []}
        
    prompt = f"""Analyze the following communication (Call transcript or SMS) for potential scams targeting rural banking users in India. 
Content: "{content}"

Look for:
- Urgency or threats (KYC expiry, account block)
- Requests for sensitive info (OTP, PIN, CVV)
- Unrealistic promises (Lottery, rewards)
- Impersonation of bank officials

Return ONLY a valid JSON object with EXACTLY these keys: "risk_level" (must be "low", "medium", or "high"), "explanation" (string), "detected_keywords" (list of strings)."""

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            }
        )
        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        # Strip markdown json blocks if present
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini error: {e}")
        return {"risk_level": "high", "explanation": "System error analyzing text. Proceed with caution.", "detected_keywords": []}

def verify_intent_with_ai(amount: float, receiver: str, answers: list) -> dict:
    api_key = get_gemini_api_key()
    if not api_key:
        return {"decision": "block", "explanation": "API Key missing. Blocked for safety."}

    prompt = f"""Evaluate the risk of a transaction based on user intent.
Transaction: Sending {amount} to {receiver}.
User's answers to verification questions: {', '.join(answers)}

Determine if the user is being coerced or tricked.
Return ONLY a valid JSON object with EXACTLY these keys: "decision" (must be "allow", "warn", or "block"), "explanation" (string)."""

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            }
        )
        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini error: {e}")
        return {"decision": "block", "explanation": "System error analyzing intent. Blocked for safety."}

def chat_with_ai(message: str, history: list) -> str:
    api_key = get_gemini_api_key()
    if not api_key:
        return "I am currently disconnected from my servers (API Key missing)."

    contents = []
    for h in history:
        contents.append({"role": h["role"], "parts": [{"text": h["text"]}]})
    contents.append({"role": "user", "parts": [{"text": message}]})

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            headers={"Content-Type": "application/json"},
            json={
                "systemInstruction": {
                    "parts": [{"text": "You are SENTRYA AI, a helpful and protective banking assistant for rural Indian users. Your goal is to explain banking safety, identify scams, and help users navigate the app in simple language. Keep responses concise."}]
                },
                "contents": contents
            }
        )
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Gemini error: {e}")
        return "I'm having trouble connecting right now. Please try again later."
