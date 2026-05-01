import logging
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend.models import Base, User
from backend.auth import get_password_hash

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_db():
    logger.info("Initializing complete database tables...")
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if user already exists
        user = db.query(User).filter(User.email == "user@test.com").first()
        if not user:
            logger.info("Creating test user user@test.com / 123456...")
            hashed_pw = get_password_hash("123456")
            test_user = User(
                name="Test User",
                email="user@test.com",
                phone="1234567890",
                hashed_password=hashed_pw,
                role="user"
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            logger.info("Test user seeded successfully.")
        else:
            logger.info("Test user already exists. Skipping seed.")
    except Exception as e:
        logger.error(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
