# Minnesota Unemployment Platform (Simulation)

A modern, production-ready simulation of the Minnesota Unemployment Insurance application process. Features a **Python FastAPI backend** with **real-time job search powered by Google Jobs via SerpApi**, **AI-powered career suggestions**, and a **gamified job application tracking system**.

[View on GitHub](https://github.com/habibshahid2013/Unemployment-application) | [Live Demo](https://unemployment-application.vercel.app)

---

## ✨ Key Features

### 🏠 Unemployment Benefits

- **Eligibility Checker**: Interactive wizard with smart validation
- **Smart Application**: Multi-step form with progress saving
- **Dashboard**: Real-time status tracking with notifications
- **Weekly Requests**: Guided workflow for certifying weekly claims
- **Admin Portal**: `/admin` interface for caseworker review and approval

### 💼 Job Search (Google Jobs Integration)

- **Real-Time Job Search**: Powered by **SerpApi Google Jobs API**
- **Global Location Support**: Search jobs anywhere - Minnesota, USA, or worldwide
- **Smart Filters**: Filter by posting date (Today, 3 Days, Week, Month) and work type (Remote, Hybrid, On-site)
- **Rich Job Details**: Salary info, qualifications, benefits, responsibilities
- **Direct Apply Links**: One-click access to original job postings
- **Company Logos**: Visual job cards with employer branding

### 🤖 AI-Powered Features

- **Smart Job Suggestions**: Powered by **Groq LLM (Llama 3.3-70B)**
- **Career Path Recommendations**: Related roles and alternative career pivots
- **Fallback Career Mapping**: 50+ job categories with intelligent matching

### 🎮 Gamification & Rewards

- **Points System**: Earn 25 points per job application
- **Weekly Goals**: Track progress toward 5 applications/week target
- **Profile Strength**: Gamified dashboard with engagement metrics
- **Application Logging**: Track all applied jobs with status

### 📋 Job Application Tracker (`/my-applications`)

- **Track All Applications**: Status management (Applied → Following Up → Interviewing → Offer)
- **Smart Reminders**: Follow-up prompts after 7 days
- **Contact Management**: Store recruiter/hiring manager details
- **Notes & History**: Add notes and track application timeline

### ✉️ AI Follow-Up Generator

- **Personalized Emails**: LLM generates follow-up emails based on job description + resume
- **LinkedIn Messages**: Professional connection messages
- **One-Click Send**: Opens email client with pre-filled content
- **Edit Before Sending**: Full control over generated content

---

## 🛠️ Tech Stack

| Layer           | Technology                                          |
| --------------- | --------------------------------------------------- |
| **Frontend**    | Next.js 15 (App Router), TypeScript, Material UI v6 |
| **Backend API** | Python FastAPI (deployed on Vercel)                 |
| **Job Search**  | SerpApi Google Jobs API                             |
| **AI/LLM**      | Groq Cloud (Llama 3.3-70B-Versatile)                |
| **Database**    | Firebase Firestore (optional) / In-Memory Store     |
| **Styling**     | Custom "MN Blue" Theme                              |
| **Deployment**  | Vercel (with Python runtime)                        |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (for local API development)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/habibshahid2013/Unemployment-application.git
   cd mn-unemployment-platform
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

Create a `.env.local` file with:

```env
# Required for Job Search
SERPAPI_KEY=your_serpapi_key

# Optional: AI-Powered Suggestions
GROQ_API_KEY=your_groq_api_key

# Optional: Firebase Persistence
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
```

| Variable       | Required | Description                                                                  |
| -------------- | -------- | ---------------------------------------------------------------------------- |
| `SERPAPI_KEY`  | ✅ Yes   | Enables Google Jobs search ([Get API Key](https://serpapi.com))              |
| `GROQ_API_KEY` | ❌ No    | Enables AI-powered job suggestions ([Get API Key](https://console.groq.com)) |
| Firebase vars  | ❌ No    | Enables persistent storage (defaults to in-memory)                           |

---

## 🌐 API Endpoints

The Python FastAPI backend provides:

| Endpoint                    | Method    | Description                          |
| --------------------------- | --------- | ------------------------------------ |
| `/api/v1/search`            | GET       | Search jobs with filters             |
| `/api/v1/suggest-jobs`      | GET       | AI-powered job title suggestions     |
| `/api/v1/generate-followup` | POST      | AI follow-up email/message generator |
| `/api/v1/find-contact`      | GET       | Contact discovery via SerpApi        |
| `/api/v1/status`            | GET       | Get application status               |
| `/api/v1/apply`             | POST      | Submit unemployment application      |
| `/api/v1/work-log`          | POST      | Log job application activity         |
| `/api/v1/admin`             | GET/PATCH | Admin portal endpoints               |
| `/api/v1/ai/chat-assist`    | POST      | AI career chat assistance            |
| `/api/v1/docs`              | GET       | Swagger API documentation            |

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhabibshahid2013%2FUnemployment-application)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Deploy!

### Command Line

```bash
npm run deploy        # Preview deployment
npm run deploy:prod   # Production deployment
```

---

## 🎯 Demo Flow

1. **Log In**: Use any email/password or Google Sign-In
2. **Check Eligibility**: Complete the eligibility wizard
3. **Apply**: Submit a simulated unemployment application
4. **Search Jobs**: Use the Job Search with real Google Jobs data
5. **Apply to Jobs**: Track applications and earn points
6. **Admin Review**: Go to `/admin` to approve applications
7. **Weekly Claim**: File weekly certification requests

---

## 📁 Project Structure

```
mn-unemployment-platform/
├── api/
│   └── index.py          # Python FastAPI backend
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── admin/        # Admin portal
│   │   ├── apply/        # Application flow
│   │   ├── dashboard/    # User dashboard
│   │   ├── eligibility/  # Eligibility checker
│   │   ├── my-applications/  # Job application tracker
│   │   ├── work-search/  # Job search page
│   │   └── ...
│   ├── components/       # Reusable UI components
│   └── lib/
│       ├── applications.ts  # Application state management
│       ├── auth.ts          # Authentication
│       └── linkedin.ts      # Job search utilities
├── vercel.json           # Vercel configuration
└── package.json
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

_Disclaimer: This is a simulation for demonstration purposes only. Not affiliated with the State of Minnesota._
