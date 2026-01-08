#!/usr/bin/env python
"""Clear all users from the database."""
import sys
sys.path.insert(0, '.')

from app.db.session import SessionLocal
from app.models.user import User

try:
    db = SessionLocal()
    
    # Delete all users
    db.query(User).delete()
    db.commit()
    
    print("✓ All users deleted!")
    db.close()
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
