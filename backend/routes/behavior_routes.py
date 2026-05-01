from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, database, auth
from ..ml.behavior_engine import analyze_user_behavior
from ..utils.alert_utils import create_user_alert

router = APIRouter(prefix="/api/behavior", tags=["Behavior Analysis"])

@router.get("/analyze/{user_id}", response_model=schemas.BehaviorAnalysisResponse)
def get_user_behavior(user_id: int, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    result = analyze_user_behavior(user_id, db)
    
    if result["is_anomalous"]:
        create_user_alert(db, user_id, "High anomaly detected. Activity deviates drastically from usual behavior.", "high")

    return schemas.BehaviorAnalysisResponse(
        anomaly_score=result["anomaly_score"],
        is_anomalous=result["is_anomalous"]
    )
