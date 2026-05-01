from fastapi import APIRouter, Depends
from .. import schemas, database, auth, models
from ..utils.gemini_client import analyze_scam_with_ai
from ..utils.alert_utils import create_user_alert
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/scam", tags=["Scam Detection"])

@router.post("/detect", response_model=schemas.ScamDetectionResponse)
def detect_scam(request: schemas.ScamDetectionRequest, db: Session = Depends(database.get_db)):
    analysis = analyze_scam_with_ai(request.text)
    
    if analysis.get("risk_level") in ["high", "medium"] and request.user_id is not None:
        create_user_alert(db, request.user_id, f"Scam Detected: {analysis.get('explanation', 'Unknown threat')}", analysis.get("risk_level", "medium"))
        
    return schemas.ScamDetectionResponse(
        risk_level=analysis.get("risk_level", "low"),
        detected_keywords=analysis.get("detected_keywords", []),
        explanation=analysis.get("explanation", "Safe")
    )

@router.post("/report")
def report_scam(request: schemas.ScamReportRequest, db: Session = Depends(database.get_db), current_user = Depends(auth.get_current_user)):
    new_report = models.ScamReport(
        phone_number=request.phone_number,
        reported_by=request.user_id
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"message": "Scam reported successfully", "id": new_report.id}

@router.get("/check/{phone_number}", response_model=schemas.ScamCheckResponse)
def check_scam(phone_number: str, db: Session = Depends(database.get_db)):
    report_count = db.query(models.ScamReport).filter(models.ScamReport.phone_number == phone_number).count()
    # If the number has been reported at least once, flag it as a scam
    is_scam = report_count > 0
    return schemas.ScamCheckResponse(
        is_scam=is_scam,
        report_count=report_count
    )
