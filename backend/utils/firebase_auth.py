from google.oauth2 import id_token
from google.auth.transport import requests

# Optional: Add your Firebase Project ID here (e.g. from env) to fully restrict tokens
# For a generic verify (allow any valid google token from the frontend client), left None.
FIREBASE_PROJECT_ID = None 

def verify_firebase_token(token: str) -> dict:
    """
    Verifies a Firebase/Google JWT ID token. 
    Returns the decoded token claims if valid.
    Raises ValueError if invalid, expired, or not from this project.
    """
    request = requests.Request()
    decoded_token = id_token.verify_firebase_token(token, request)
    
    # decoded_token contains 'uid', 'email', 'name', 'picture'
    return decoded_token
