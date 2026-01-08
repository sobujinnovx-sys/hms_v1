#!/usr/bin/env python
"""Check users in database."""
import sys
sys.path.insert(0, '.')

from app.db.session import SessionLocal
from app.models.user import User

try:
    db = SessionLocal()
    users = db.query(User).all()
    print(f"Total users: {len(users)}")
    for user in users:
        print(f"  - {user.email} ({user.username}): {user.role}")
    db.close()
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
