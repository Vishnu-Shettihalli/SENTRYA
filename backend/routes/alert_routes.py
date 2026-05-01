from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, database, auth, models

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("/{user_id}", response_model=List[schemas.AlertResponse])
def get_user_alerts(user_id: int, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    alerts = db.query(models.Alert).filter(models.Alert.user_id == user_id).order_by(models.Alert.created_at.desc()).all()
    # Pydantic will map timestamp from created_at
    return [
        schemas.AlertResponse(
            message=a.message,
            risk_level=a.risk_level,
            timestamp=a.created_at
        ) for a in alerts
    ]
