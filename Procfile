release: cd backend && alembic upgrade head || true
web: cd backend && gunicorn app.main:app --workers 3 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 30
