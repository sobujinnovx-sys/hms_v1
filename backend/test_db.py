import sys
sys.path.insert(0, 'e:\\laragon\\www\\FastApi-React\\backend')

from app.core.config import get_settings
from app.db.session import SessionLocal
from app.models.user import User

try:
    settings = get_settings()
    print(f"Database URL: {settings.database_url}")
    
    db = SessionLocal()
    print("Database connection successful!")
    
    # Check if tables exist
    users = db.query(User).all()
    print(f"Found {len(users)} users in database")
    
    db.close()
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
