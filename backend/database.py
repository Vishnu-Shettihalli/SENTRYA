from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Vercel Serverless Functions have a read-only filesystem except for /tmp
    if os.getenv("VERCEL"):
        DATABASE_URL = "sqlite:////tmp/sentrya.db"
    else:
        DATABASE_URL = "sqlite:///./sentrya.db"

# connect_args={"check_same_thread": False} is needed only for SQLite. Let's make sure it's resilient.
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
