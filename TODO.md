# Project TODO List

## 🚀 Infrastructure & Setup
- [x] Create automated setup script (`setup.py`)
- [x] Configure Environment Variables (`.env`)
- [x] Dockerize Backend API
- [x] Create Kubernetes Deployment & Service manifests
- [ ] Set up CI/CD Pipeline (GitHub Actions)
- [ ] **Local LLM**: Set up Ollama or LocalAI for offline inference

## 🧠 Backend API (FastAPI)
- [x] **Job Search**: Integrate SerpApi for Google Jobs
- [x] **Resume Parsing**: PDF text extraction
- [ ] **AI Features**: Migrate from Groq to Local LLM (Llama 3 / Mistral)
- [ ] **Persistence**: Implement Local Database (SQLite) to replace InMemoryStore:
    - [ ] Application tracking (`/api/v1/status`)
    - [ ] Admin dashboard data (`/api/v1/admin`)
    - [ ] Work logs (`/api/v1/work-log`)
- [ ] **Authentication**: Implement Local Auth (JWT) instead of Firebase
- [ ] **Testing**: Add unit tests for API endpoints
- [ ] **Validation**: Improve error handling and input validation

## 🎨 Frontend (React/Next.js)
- [ ] Connect Job Search UI to API
- [ ] Build Resume Upload & Parsing UI
- [ ] Create Admin Dashboard for application review
- [ ] Implement User Authentication flows

## 📝 Documentation
- [x] Developer Setup Guide
- [ ] API Usage Examples
- [ ] Local LLM Setup Guide
- [ ] Deployment Guide (Production)
