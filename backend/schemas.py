from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class FirebaseSyncRequest(BaseModel):
    id_token: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class TransactionBase(BaseModel):
    amount: float
    receiver: str
    status: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    message: str
    risk_level: str

class Alert(AlertBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ScamDetectionRequest(BaseModel):
    text: str
    user_id: Optional[int] = None

class ScamDetectionResponse(BaseModel):
    risk_level: str
    detected_keywords: List[str]
    explanation: str

class AlertResponse(BaseModel):
    message: str
    risk_level: str
    timestamp: datetime

class Answers(BaseModel):
    knows_person: bool
    urgency_flag: bool

class TransactionInitiateRequest(BaseModel):
    user_id: int
    amount: float
    receiver: str
    answers: Answers

class TransactionInitiateResponse(BaseModel):
    decision: str
    explanation: str

class BehaviorAnalysisResponse(BaseModel):
    anomaly_score: float
    is_anomalous: bool

class ScamReportRequest(BaseModel):
    phone_number: str
    user_id: int

class ScamCheckResponse(BaseModel):
    is_scam: bool
    report_count: int
