from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from .. import schemas, database, auth, models
from ..utils.alert_utils import create_user_alert

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

class CreateAlertRequest(BaseModel):
    user_id: int
    message: str
    risk_level: str

@router.post("/")
def create_alert(request: CreateAlertRequest, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    create_user_alert(db, request.user_id, request.message, request.risk_level)
    return {"message": "Alert created successfully"}

@router.get("/{user_id}", response_model=List[schemas.AlertResponse])
def get_user_alerts(user_id: int, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    # 1. Fetch user-specific alerts
    user_alerts = db.query(models.Alert).filter(models.Alert.user_id == user_id).order_by(models.Alert.created_at.desc()).all()
    
    # 2. Fetch global community scam reports
    community_reports = db.query(models.ScamReport).order_by(models.ScamReport.reported_at.desc()).limit(10).all()
    
    response = []
    
    # Add personal alerts
    for a in user_alerts:
        response.append(schemas.AlertResponse(
            message=a.message,
            risk_level=a.risk_level,
            timestamp=a.created_at
        ))
        
    # Add community reports
    for c in community_reports:
        response.append(schemas.AlertResponse(
            message=f"COMMUNITY REPORT: Scam number detected ({c.phone_number})",
            risk_level="medium", # Consider community reports as medium risk global alerts
            timestamp=c.reported_at
        ))
        
    # Sort the combined list by timestamp descending
    response.sort(key=lambda x: x.timestamp, reverse=True)
    
    return response
