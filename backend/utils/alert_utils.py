from sqlalchemy.orm import Session
from .. import models

def create_user_alert(db: Session, user_id: int, message: str, risk_level: str):
    if not user_id:
        return
    alert = models.Alert(user_id=user_id, message=message, risk_level=risk_level)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert
