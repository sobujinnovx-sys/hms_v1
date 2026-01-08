# Healthcare Management System

A complete Healthcare Management System built with FastAPI (Python backend) and React (TypeScript frontend) with full DevOps infrastructure.

## 🏗️ Project Structure

```
healthcare-system/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/v1/            # API routes
│   │   ├── core/              # Config, security, constants
│   │   ├── db/                # Database session and base
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── main.py            # FastAPI app entry
│   ├── tests/                 # Unit tests
│   ├── alembic/               # Database migrations
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile             # Docker configuration
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── stores/            # Zustand state management
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx            # Main app component
│   ├── package.json           # Node dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite config
│   └── Dockerfile             # Docker configuration
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD
├── docker-compose.yml         # Docker Compose config
├── nginx.conf                 # Nginx reverse proxy
└── DEPLOYMENT.md              # Production deployment guide
```

## 🚀 Features

### Backend (FastAPI)
- **Authentication**: JWT-based with role-based access control (RBAC)
- **Database**: MySQL with SQLAlchemy ORM
- **Migrations**: Alembic for database versioning
- **Validation**: Pydantic schemas for request/response validation
- **API Documentation**: Swagger/OpenAPI automatic documentation
- **Testing**: Unit tests with pytest

### Database Models
- **Users**: User management with roles (Admin, Doctor, Nurse, Receptionist)
- **Patients**: Patient information with medical history
- **Doctors**: Doctor information with specialization
- **Appointments**: Appointment scheduling and management
- **Medical Records**: Patient medical records with prescriptions
- **Billing**: Invoice and payment management

### Frontend (React + TypeScript)
- **Routing**: React Router for client-side routing
- **State Management**: Zustand for global state
- **Authentication**: JWT token management with auto-refresh
- **Forms**: Formik + Yup for form validation
- **UI**: Material-UI components with responsive design
- **API Integration**: Axios with interceptors

### DevOps
- **Containerization**: Docker for backend and frontend
- **Orchestration**: Docker Compose for local development
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Reverse Proxy**: Nginx for API and frontend routing
- **SSL**: Let's Encrypt for HTTPS (production)

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0+
- Git

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FastApi-React
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Database Setup

Make sure MySQL is running and create the database:

```sql
CREATE DATABASE healthcare_db;
CREATE DATABASE healthcare_db_test;
```

Update the `DATABASE_URL` in `.env`:

```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/healthcare_db
```

## 🐳 Docker Compose Development

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

Services will be available at:
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- Nginx (all routes): `http://localhost:80`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v

# Generate coverage report
pytest tests/ --cov=app --cov-report=html
```

### Frontend Tests (To be added)

```bash
cd frontend

npm run test
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/me` - Update current user

### Users (Admin only)
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user

### Patients
- `POST /api/v1/patients` - Create patient
- `GET /api/v1/patients` - List patients
- `GET /api/v1/patients/{patient_id}` - Get patient
- `PUT /api/v1/patients/{patient_id}` - Update patient
- `DELETE /api/v1/patients/{patient_id}` - Delete patient

### Doctors
- `POST /api/v1/doctors` - Create doctor
- `GET /api/v1/doctors` - List doctors
- `GET /api/v1/doctors/{doctor_id}` - Get doctor
- `PUT /api/v1/doctors/{doctor_id}` - Update doctor
- `DELETE /api/v1/doctors/{doctor_id}` - Delete doctor

### Appointments
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments` - List appointments
- `GET /api/v1/appointments/{appointment_id}` - Get appointment
- `PUT /api/v1/appointments/{appointment_id}` - Update appointment
- `DELETE /api/v1/appointments/{appointment_id}` - Delete appointment

### Medical Records
- `POST /api/v1/medical-records` - Create medical record
- `GET /api/v1/medical-records` - List medical records
- `GET /api/v1/medical-records/{record_id}` - Get medical record
- `PUT /api/v1/medical-records/{record_id}` - Update medical record
- `DELETE /api/v1/medical-records/{record_id}` - Delete medical record
- `POST /api/v1/medical-records/{record_id}/prescriptions` - Add prescription

### Billing
- `POST /api/v1/billing/bills` - Create bill
- `GET /api/v1/billing/bills` - List bills
- `GET /api/v1/billing/bills/{bill_id}` - Get bill
- `PUT /api/v1/billing/bills/{bill_id}` - Update bill
- `DELETE /api/v1/billing/bills/{bill_id}` - Delete bill
- `POST /api/v1/billing/bills/{bill_id}/payments` - Create payment

## 🔐 Authentication & Authorization

### JWT Token
Tokens are issued upon login and must be included in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Role-Based Access Control
- **Admin**: Full system access
- **Doctor**: Can view/create medical records and appointments
- **Nurse**: Can view patient information
- **Receptionist**: Can manage appointments and patient registration

## 📦 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql+pymysql://user:password@host:port/database
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
DEBUG=True
LOG_LEVEL=INFO
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 🚢 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- AWS EC2 deployment
- DigitalOcean Droplet setup
- GCP VM configuration
- Nginx SSL configuration
- Database backup strategies
- Monitoring and logging

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: description of your changes"

# Push to remote
git push origin feature/your-feature

# Create pull request and merge after review
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- FastAPI for the excellent async framework
- React for the declarative UI
- Material-UI for beautiful components
- SQLAlchemy for ORM functionality
