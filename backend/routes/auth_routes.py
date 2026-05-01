from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import schemas, models, auth, database
from ..utils.firebase_auth import verify_firebase_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/firebase-sync", response_model=schemas.Token)
def sync_firebase_user(request: schemas.FirebaseSyncRequest, db: Session = Depends(database.get_db)):
    try:
        decoded_token = verify_firebase_token(request.id_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Firebase token invalid: {str(e)}")
        
    email = decoded_token.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Token missing email")

    # Sync to local DB
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if not db_user:
        db_user = models.User(email=email, hashed_password="firebase_managed", name=request.name)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
    access_token_expires = timedelta(days=30)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.Token)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token_expires = timedelta(days=30)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # The requirement is token expiry 30 days
    access_token_expires = timedelta(days=30)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
