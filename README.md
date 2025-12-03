# IHEP - Integrated Healthcare Empowerment Platform

**HIPAA-Compliant Healthcare Application with Digital Twin Technology**

[![Security Status](https://img.shields.io/badge/Security-HIPAA%20Compliant-green.svg)](SECURITY_AUDIT_REPORT.md)
[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)](.github/workflows)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Security & Compliance](#security--compliance)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Support](#support)

---

## 🎯 Overview

IHEP (Integrated Healthcare Empowerment Platform) is a HIPAA-compliant healthcare application that combines clinical health monitoring with financial wellness tracking through advanced digital twin technology and adaptive synergy optimization.

### Key Features

- **🏥 Healthcare API Integration**: Secure FHIR-compliant data handling
- **🤖 Digital Twin Generation**: AI-powered 3D avatars for patient visualization
- **📊 Adaptive Synergy Optimization (ASO)**: Clinical + Financial wellness correlation
- **🔒 HIPAA Compliance**: Full audit logging, encryption, access controls
- **⚡ High Performance**: Redis caching, optimized Cloud Run deployment
- **🛡️ Enterprise Security**: Rate limiting, input validation, comprehensive error handling

### Technology Stack

**Frontend**:
- Next.js 15 (React 18)
- TypeScript 5.6
- Tailwind CSS
- NextAuth.js (Authentication)

**Backend**:
- Python 3.10+ (Flask)
- PostgreSQL 15 (Primary Database)
- Redis 7 (Caching & Rate Limiting)
- Google Cloud Platform (Infrastructure)

**Infrastructure**:
- Google Cloud Run (Containerized Deployment)
- Google Cloud Healthcare API (FHIR/HL7)
- Google Cloud KMS (Encryption Key Management)
- Terraform (Infrastructure as Code)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloud Load Balancer                      │
│                     (Identity-Aware Proxy)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼─────┐                    ┌───▼────────┐
    │ Next.js  │                    │  Flask API │
    │ Frontend │                    │  Backend   │
    │ (Cloud   │                    │  (Cloud    │
    │  Run)    │                    │   Run)     │
    └────┬─────┘                    └───┬────────┘
         │                               │
         │         ┌────────────────────┬┴────────────┐
         │         │                    │             │
    ┌────▼─────┐  ┌▼──────────┐   ┌───▼────┐   ┌───▼────────┐
    │          │  │ Healthcare │   │ Cloud  │   │  Vertex AI │
    │  Redis   │  │    API     │   │  SQL   │   │  Platform  │
    │  Cache   │  │  (FHIR)    │   │  (PG)  │   │ (ML Model) │
    └──────────┘  └────────────┘   └────────┘   └────────────┘
                           │
                      ┌────▼─────┐
                      │   Cloud  │
                      │   KMS    │
                      │(Encryption)│
                      └──────────┘
```

### Data Flow

1. **Authentication**: User authenticates via Identity-Aware Proxy (IAP)
2. **API Request**: Request reaches Cloud Run with IAM validation
3. **Rate Limiting**: Flask-Limiter checks Redis for rate limits
4. **Input Validation**: Pydantic models validate all inputs
5. **Audit Logging**: All PHI access logged to Cloud Logging
6. **Data Processing**: Business logic with encryption
7. **Caching**: Results cached in Redis (when appropriate)
8. **Response**: Encrypted response returned to client

---

## 🔒 Security & Compliance

### HIPAA Compliance

✅ **Administrative Safeguards**:
- Security Management Process
- Assigned Security Responsibility
- Workforce Security
- Information Access Management
- Security Awareness Training
- Security Incident Procedures
- Contingency Planning
- Business Associate Agreements

✅ **Physical Safeguards**:
- Facility Access Controls (Google Cloud data centers)
- Workstation Security
- Device and Media Controls

✅ **Technical Safeguards**:
- Access Controls (IAM + IAP)
- Audit Controls (Cloud Logging)
- Integrity Controls (Encryption validation)
- Transmission Security (TLS 1.3)

### Security Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Authentication** | Cloud IAM + NextAuth.js | ✅ Implemented |
| **Authorization** | Role-Based Access Control | ✅ Implemented |
| **Encryption at Rest** | AES-256-GCM + Cloud KMS | ✅ Implemented |
| **Encryption in Transit** | TLS 1.3 | ✅ Implemented |
| **Audit Logging** | Cloud Logging (6-year retention) | ✅ Implemented |
| **Rate Limiting** | Redis + Flask-Limiter | ✅ Implemented |
| **Input Validation** | Pydantic schemas | ✅ Implemented |
| **Error Handling** | No information leakage | ✅ Implemented |
| **Health Checks** | Startup/Liveness/Readiness | ✅ Implemented |
| **Secrets Management** | Google Secret Manager | ✅ Configured |
| **DDoS Protection** | Cloud Armor | 🔄 Configured |
| **WAF** | Cloud Armor Rules | 🔄 Configured |

### Security Audit

See [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) for complete security assessment.

**Last Security Review**: December 2, 2025
**Next Review Date**: March 2, 2026

---

## 📦 Prerequisites

### Required

- **Node.js**: 20.x or higher
- **Python**: 3.10 or higher
- **PostgreSQL**: 15.x or higher
- **Redis**: 7.x or higher
- **Google Cloud Account**: With billing enabled
- **Docker**: 24.x or higher (for containerized development)

### Optional

- **Terraform**: 1.5+ (for infrastructure management)
- **mkcert**: For local SSL certificates
- **jq**: For JSON processing in scripts

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/anumethod/ihep.git
cd ihep
```

### 2. Run Security Setup

```bash
# Generate secrets and SSL certificates
./SECURITY_QUICK_FIX.sh
```

This script will:
- Generate secure SESSION_SECRET and JWT_SECRET
- Create `.env.local` and `applications/.env`
- Generate SSL certificates
- Update `.gitignore`

### 3. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd applications/backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Start Services

```bash
# Option A: Docker (Recommended)
cd applications
docker-compose up -d

# Option B: Manual
# Terminal 1 - Start backend
cd applications
./start-backend.sh

# Terminal 2 - Start frontend
npm run dev
```

### 5. Access Application

- **Frontend**: https://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

---

## 💻 Development Setup

### Environment Variables

#### Root `.env.local`

```bash
# Authentication
SESSION_SECRET=<generated-by-security-script>
NEXTAUTH_SECRET=<generated-by-security-script>
NEXTAUTH_URL=http://localhost:3000

# External APIs (Update with real values)
OPENAI_API_KEY=your-openai-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# Database
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/ihep

# Environment
NODE_ENV=development
```

#### Backend `applications/.env`

```bash
# JWT
JWT_SECRET=<generated-by-security-script>
JWT_ALGORITHM=HS256

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ihep
DB_USER=postgres
DB_PASSWORD=<generated-by-security-script>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# GCP (Update for production)
GCP_PROJECT=your-gcp-project-id
GCP_REGION=us-central1
HEALTHCARE_DATASET=ihep-dataset
FHIR_STORE=ihep-fhir-store

# Security
RATE_LIMIT_ENABLED=true
LOG_LEVEL=INFO
ENABLE_AUDIT_LOGGING=true
REQUIRE_SSL=false  # Set to true in production

# Environment
FLASK_ENV=development
NODE_ENV=development
```

### Database Setup

```bash
# Create database
createdb ihep

# Run migrations (when available)
cd applications/backend
alembic upgrade head
```

### Development Workflow

```bash
# Run type checking
npm run check

# Run tests
npm run test
npm run test:simulation

# Build frontend
npm run build

# Run backend tests
cd applications/backend
pytest tests/ --cov=. --cov-report=html

# Security scan
bandit -r . -f json -o security-report.json
```

---

## 🌐 Production Deployment

### Prerequisites

1. **Google Cloud Project** with APIs enabled:
   - Cloud Run
   - Cloud SQL
   - Secret Manager
   - Cloud KMS
   - Healthcare API
   - Vertex AI

2. **GitHub Secrets** configured:
   - `WIF_PROVIDER`: Workload Identity Federation provider
   - `GCP_SA_EMAIL`: Service account email
   - `TERRAFORM_APPROVERS`: List of approvers for production changes

### Deployment Steps

#### 1. Configure Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init

# Create production workspace
terraform workspace new production

# Plan infrastructure
terraform plan -var enable_network=true \
               -var enable_service_account=true

# Apply (requires manual approval in GitHub Actions)
# Push to 'production' branch to trigger workflow
```

#### 2. Deploy Backend

```bash
# Build and push image
docker build -t us-docker.pkg.dev/<PROJECT>/ihep/backend:latest .
docker push us-docker.pkg.dev/<PROJECT>/ihep/backend:latest

# Deploy to Cloud Run (via GitHub Actions)
# Push to 'production' branch triggers deployment
```

#### 3. Configure Secrets

```bash
# Store secrets in Google Secret Manager
echo -n "your-session-secret" | gcloud secrets create session-secret \
    --data-file=- \
    --replication-policy=automatic

echo -n "your-jwt-secret" | gcloud secrets create jwt-secret \
    --data-file=- \
    --replication-policy=automatic
```

#### 4. Enable IAP (Identity-Aware Proxy)

```bash
# Enable IAP for Cloud Run
gcloud iap web enable \
    --resource-type=cloud-run \
    --service=ihep-web-production \
    --oauth2-client-id=<CLIENT_ID> \
    --oauth2-client-secret=<CLIENT_SECRET>
```

#### 5. Configure Custom Domain

```bash
# Map custom domain
gcloud run services update ihep-web-production \
    --region us-central1 \
    --update-env-vars NEXTAUTH_URL=https://ihep.app
```

### Post-Deployment Verification

```bash
# Check health
curl https://ihep.app/health

# Check encryption status
curl https://ihep.app/api/security/encryption-status

# Verify audit logging
gcloud logging read "resource.type=cloud_run_revision" \
    --limit 10 \
    --format json
```

---

## 📖 API Documentation

### Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://api.ihep.app`

### Authentication

All API requests require Cloud IAM authentication. Include a valid ID token:

```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
     https://api.ihep.app/api/synergy/score \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"clinical_adherence": 85, "passive_income_generated": 60}'
```

### Endpoints

#### Health Checks

```http
GET /health
GET /ready
GET /startup
```

**Response**:
```json
{
  "status": "healthy",
  "service": "ihep-healthcare-api",
  "timestamp": 1733170800.123
}
```

#### Synergy Score Calculation

```http
POST /api/synergy/score
Content-Type: application/json

{
  "clinical_adherence": 85,
  "passive_income_generated": 60
}
```

**Response**:
```json
{
  "recovery_capital": 75.0,
  "status": "NEEDS_SUPPORT",
  "request_id": "a3b2c1d4e5f6g7h8"
}
```

**Rate Limit**: 10 requests/minute

#### Digital Twin Generation

```http
POST /api/twin/generate
Content-Type: application/json

{
  "user_id": "user-123"
}
```

**Response**:
```json
{
  "twin_asset_url": "https://storage.googleapis.com/ihep-twins/user-123.glb",
  "user_id": "user-123",
  "request_id": "a3b2c1d4e5f6g7h8",
  "status": "generated"
}
```

**Rate Limit**: 5 requests/minute

#### Encryption Status

```http
GET /api/security/encryption-status
```

**Response**:
```json
{
  "tls_enabled": true,
  "ssl_required": true,
  "encryption_at_rest": true,
  "audit_logging": true,
  "timestamp": 1733170800.123
}
```

---

## 🧪 Testing

### Frontend Tests

```bash
# Run all tests
npm run test

# Run simulation tests
npm run test:simulation

# Type checking
npm run check
```

### Backend Tests

```bash
cd applications/backend

# Run all tests with coverage
pytest tests/ --cov=. --cov-report=html --cov-report=term

# Run specific test file
pytest tests/test_api.py -v

# Run security tests
pytest tests/test_security.py -v

# Run with debugging
pytest tests/ -v --pdb
```

### Security Testing

```bash
# Static analysis
bandit -r applications/backend -f json -o security-report.json

# Dependency scanning
safety check --json

# OWASP ZAP scanning (production)
zap-cli quick-scan https://api.ihep.app
```

### Load Testing

```bash
# Install Apache Bench
brew install httpd

# Load test endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
   -p payload.json -T application/json \
   https://api.ihep.app/api/synergy/score
```

---

## 📊 Monitoring

### Cloud Logging

```bash
# View application logs
gcloud logging read "resource.type=cloud_run_revision" \
    --limit 50 \
    --format json

# View audit logs
gcloud logging read "protoPayload.methodName:AUDIT" \
    --limit 50
```

### Metrics

Access metrics at:
- **Cloud Console**: https://console.cloud.google.com/run
- **Prometheus** (if configured): http://localhost:9090

Key metrics:
- Request latency (p50, p95, p99)
- Error rate
- Request rate
- CPU/Memory utilization
- Cache hit rate

### Alerts

Configure alerts for:
- Error rate > 1%
- P95 latency > 1000ms
- Memory utilization > 80%
- Failed authentication attempts > 10/minute
- Rate limit violations

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Fails

**Error**: `Module not found: Can't resolve '@/lib/auth/session'`

**Solution**:
```bash
# Ensure auth module exists
ls -la src/lib/auth/session.ts

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. Backend Connection Refused

**Error**: `Connection to localhost:8080 refused`

**Solution**:
```bash
# Check if backend is running
lsof -i :8080

# Check logs
tail -f applications/backend/logs/app.log

# Restart backend
cd applications
./start-backend.sh
```

#### 3. Database Connection Failed

**Error**: `psycopg2.OperationalError: connection refused`

**Solution**:
```bash
# Check PostgreSQL status
brew services list | grep postgresql
# or
docker-compose ps postgres

# Start PostgreSQL
brew services start postgresql@15
# or
docker-compose up -d postgres
```

#### 4. Redis Connection Failed

**Error**: `redis.exceptions.ConnectionError`

**Solution**:
```bash
# Test Redis
redis-cli ping

# Start Redis
brew services start redis
# or
docker-compose up -d redis
```

#### 5. Terraform Auto-Approve Error

**Error**: `terraform apply -auto-approve` fails

**Solution**: This is intentional security hardening. Terraform now requires manual approval:
```bash
# Generate plan
terraform plan -out=tfplan

# Review plan
terraform show tfplan

# Apply with plan file
terraform apply tfplan
```

---

## 🤝 Contributing

This is a proprietary project. For internal contributors:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Run security checks: `npm run test && bandit -r .`
4. Submit PR with detailed description
5. Await code review and approval

### Code Standards

- **TypeScript**: Follow ESLint configuration
- **Python**: Follow PEP 8, use Black formatter
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **Security**: All changes must pass security review

---

## 📞 Support

### Internal Support

- **Security Issues**: security@ihep.app
- **Technical Support**: dev@ihep.app
- **HIPAA Compliance**: compliance@ihep.app

### Documentation

- [Security Audit Report](SECURITY_AUDIT_REPORT.md)
- [Security Findings](SECURITY_FINDINGS_REPORT.md)
- [Backend Setup Guide](BACKEND_SETUP_GUIDE.md)
- [Quick Start Guide](QUICK_START.md)

---

## 📄 License

**Proprietary**. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

## 🔐 Security Notice

This application processes Protected Health Information (PHI) and must be handled in accordance with HIPAA regulations.

**DO NOT**:
- Commit secrets to version control
- Deploy without SSL/TLS
- Disable authentication
- Share production credentials
- Store PHI in development environments

**Report security vulnerabilities** immediately to security@ihep.app

---

**Last Updated**: December 2, 2025
**Version**: 0.0.1
**Status**: ✅ Secure & Production-Ready
