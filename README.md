# Minnesota Unemployment Platform

A modern, production-ready simulation of the Minnesota Unemployment Insurance application process. Features a **Python FastAPI backend** with **real-time job search powered by Google Jobs via SerpApi**, **AI-powered career suggestions**, **Gmail OAuth integration**, and a **gamified job application tracking system**.

[View on GitHub](https://github.com/habibshahid2013/Unemployment-application) | [Live Demo](https://unemployment-application.vercel.app)

---

## ✨ Key Features

### 🏠 Unemployment Benefits Simulation

- **Eligibility Checker**: Interactive wizard with smart validation
- **Smart Application**: Multi-step form with progress saving
- **Dashboard**: Real-time status tracking with notifications
- **Weekly Requests**: Guided workflow for certifying weekly claims
- **Admin Portal**: `/admin` interface for caseworker review and approval

### 💼 Job Search (Google Jobs Integration)

- **Real-Time Job Search**: Powered by **SerpApi Google Jobs API**
- **30-50 Jobs Per Search**: Fetches 3 pages of results with pagination
- **Industry Filter**: Filter by Technology, Healthcare, Finance, Retail, and more
- **Smart Filters**: Filter by posting date (Today, 3 Days, Week, Month) and work type (Remote, Hybrid, On-site)
- **Rich Job Details**: Salary info, qualifications, benefits, responsibilities
- **Direct Apply Links**: One-click access to original job postings
- **Company Logos**: Visual job cards with employer branding

### 🤖 AI-Powered Features

- **Smart Job Suggestions**: Powered by **Groq LLM (Llama 3.3-70B)**
- **AI Follow-Up Generator**: Creates personalized email and LinkedIn messages
- **Career Path Recommendations**: Related roles and alternative career pivots
- **Fallback Career Mapping**: 50+ job categories with intelligent matching

### 📋 Job Application Tracker (`/my-applications`)

- **Track All Applications**: Status management (Applied → Following Up → Interviewing → Offer)
- **Smart Reminders**: Follow-up prompts after 7 days
- **Contact Management**: Store recruiter/hiring manager details
- **Notes & History**: Add notes and track application timeline
- **Modern UI**: Glassmorphism design with smooth animations

### ✉️ Gmail OAuth Integration

- **Direct Email Sending**: Send follow-up emails directly via Gmail API
- **Connect Gmail Button**: One-click OAuth authentication
- **Fallback Support**: Uses mailto: if Gmail not connected
- **Attachment Support**: API supports resume attachments

### 🎮 Gamification & Rewards

- **Points System**: Earn 25 points per job application
- **Weekly Goals**: Track progress toward 5 applications/week target
- **Bonus Points**: +50 bonus for completing weekly goal
- **Profile Strength**: Gamified dashboard with engagement metrics

---

## 🛠️ Tech Stack

| Layer           | Technology                                          |
| --------------- | --------------------------------------------------- |
| **Frontend**    | Next.js 16 (App Router), TypeScript, Material UI v6 |
| **Backend API** | Python FastAPI (deployed on Vercel)                 |
| **Job Search**  | SerpApi Google Jobs API                             |
| **AI/LLM**      | Groq Cloud (Llama 3.3-70B-Versatile)                |
| **Auth**        | NextAuth.js with Google OAuth                       |
| **Email**       | Gmail API                                           |
| **Database**    | Firebase Firestore (optional) / localStorage        |
| **Styling**     | Custom "MN Blue" Theme with Glassmorphism           |
| **Deployment**  | Vercel (with Python runtime)                        |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (for local API development)
- npm or yarn

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

3. **Set up environment variables** (see Environment Variables section below)

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Running the Backend Locally

The Python FastAPI backend runs automatically through Vercel's Python runtime. For local development:

```bash
# Install Python dependencies
pip install fastapi requests python-dotenv

# The API is integrated via vercel.json rewrites
# Just run npm run dev and it works!
```

### Production Build

```bash
npm run build    # Create production build
npm start        # Start production server
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# ===== REQUIRED =====
SERPAPI_KEY=your_serpapi_key_here

# ===== RECOMMENDED =====
GROQ_API_KEY=your_groq_api_key_here

# ===== GMAIL OAUTH (for direct email sending) =====
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=any_random_secret_string_here
NEXTAUTH_URL=http://localhost:3000

# ===== OPTIONAL: Firebase Persistence =====
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
```

### Environment Variables Reference

| Variable               | Required       | Description                               | Get It From                                              |
| ---------------------- | -------------- | ----------------------------------------- | -------------------------------------------------------- |
| `SERPAPI_KEY`          | ✅ Yes         | Enables Google Jobs search                | [serpapi.com](https://serpapi.com)                       |
| `GROQ_API_KEY`         | ⭐ Recommended | AI job suggestions & follow-up generation | [console.groq.com](https://console.groq.com)             |
| `GOOGLE_CLIENT_ID`     | ❌ Optional    | Gmail OAuth authentication                | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | ❌ Optional    | Gmail OAuth authentication                | [Google Cloud Console](https://console.cloud.google.com) |
| `NEXTAUTH_SECRET`      | ❌ Optional    | Session encryption key                    | Generate any random string                               |
| Firebase vars          | ❌ Optional    | Persistent storage                        | [Firebase Console](https://console.firebase.google.com)  |

---

## 🔌 External APIs Used

### 1. SerpApi (Google Jobs)

- **Purpose**: Real-time job search with rich data
- **Endpoint**: `https://serpapi.com/search?engine=google_jobs`
- **Features**: Job title, company, salary, qualifications, apply links, company logos
- **Pricing**: 100 free searches/month, then paid plans
- **Docs**: [serpapi.com/google-jobs-api](https://serpapi.com/google-jobs-api)

### 2. Groq Cloud (LLM)

- **Purpose**: AI-powered job suggestions and follow-up email generation
- **Model**: Llama 3.3-70B-Versatile
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Features**: Fast inference, OpenAI-compatible API
- **Pricing**: Free tier available
- **Docs**: [console.groq.com/docs](https://console.groq.com/docs)

### 3. Google OAuth & Gmail API

- **Purpose**: Authenticate users and send emails directly
- **Scopes**: `gmail.send`, `email`, `profile`
- **Features**: Direct email sending without opening email client
- **Setup**: See `docs/GMAIL_OAUTH_SETUP.md`
- **Docs**: [developers.google.com/gmail](https://developers.google.com/gmail/api)

---

## 🌐 API Endpoints

### Python FastAPI Backend (`/api/v1/`)

| Endpoint                    | Method | Description                                 | Auth |
| --------------------------- | ------ | ------------------------------------------- | ---- |
| `/api/v1/search`            | GET    | Search jobs (30-50 results, 3 pages)        | None |
| `/api/v1/suggest-jobs`      | GET    | AI-powered job title suggestions            | None |
| `/api/v1/generate-followup` | POST   | Generate follow-up email & LinkedIn message | None |
| `/api/v1/find-contact`      | GET    | Find hiring manager contacts via SerpApi    | None |
| `/api/v1/status`            | GET    | Get unemployment application status         | None |
| `/api/v1/apply`             | POST   | Submit unemployment application             | None |
| `/api/v1/work-log`          | POST   | Log job application activity                | None |
| `/api/v1/admin`             | GET    | List applications for admin review          | None |
| `/api/v1/admin`             | PATCH  | Update application status                   | None |
| `/api/v1/ai/chat-assist`    | POST   | AI career chat assistance                   | None |
| `/api/v1/docs`              | GET    | Swagger/OpenAPI documentation               | None |

### Next.js API Routes

| Endpoint                  | Method   | Description                | Auth        |
| ------------------------- | -------- | -------------------------- | ----------- |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js authentication | None        |
| `/api/gmail/send`         | POST     | Send email via Gmail API   | OAuth Token |

### Example API Calls

```bash
# Search for jobs
curl "https://unemployment-application.vercel.app/api/v1/search?query=software+engineer&location=Minnesota&date_filter=week"

# Get AI job suggestions
curl "https://unemployment-application.vercel.app/api/v1/suggest-jobs?query=developer"

# Generate follow-up email
curl -X POST "https://unemployment-application.vercel.app/api/v1/generate-followup" \
  -H "Content-Type: application/json" \
  -d '{"jobTitle": "Software Engineer", "company": "Google", "jobDescription": "Build amazing products..."}'
```

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhabibshahid2013%2FUnemployment-application)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in **Settings → Environment Variables**
4. Deploy!

### Environment Variables in Vercel

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

- `SERPAPI_KEY` (Required)
- `GROQ_API_KEY` (Recommended)
- `GOOGLE_CLIENT_ID` (For Gmail)
- `GOOGLE_CLIENT_SECRET` (For Gmail)
- `NEXTAUTH_SECRET` (For sessions)

### Command Line Deployment

```bash
npm run deploy        # Preview deployment
npm run deploy:prod   # Production deployment
```

---

## 🎯 Application Flow

### User Journey

1. **Landing Page** (`/`) - Overview and navigation
2. **Login** (`/auth/login`) - Email/password or Google Sign-In
3. **Eligibility Check** (`/eligibility`) - Interactive eligibility wizard
4. **Apply for Benefits** (`/apply`) - Multi-step application form
5. **Dashboard** (`/dashboard`) - Track application status
6. **Job Search** (`/work-search`) - Find jobs with Google Jobs
7. **Track Applications** (`/my-applications`) - Manage applied jobs
8. **Weekly Claims** (`/weekly-request`) - File weekly certifications

### Admin Flow

1. Go to `/admin`
2. Review pending applications
3. Approve or deny with notes

---

## 📁 Project Structure

```
mn-unemployment-platform/
├── api/
│   └── index.py              # Python FastAPI backend (all API endpoints)
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/            # Admin review portal
│   │   ├── api/
│   │   │   ├── auth/         # NextAuth.js routes
│   │   │   └── gmail/        # Gmail send API
│   │   ├── apply/            # Unemployment application flow
│   │   ├── auth/login/       # Login page
│   │   ├── dashboard/        # User dashboard
│   │   ├── eligibility/      # Eligibility checker
│   │   ├── my-applications/  # Job application tracker
│   │   ├── work-search/      # Job search with filters
│   │   └── layout.tsx        # Root layout with providers
│   ├── components/
│   │   ├── AuthProvider.tsx  # NextAuth SessionProvider
│   │   └── NavBar.tsx        # Navigation component
│   ├── lib/
│   │   ├── applications.ts   # Job application state (localStorage)
│   │   ├── auth.ts           # Firebase auth utilities
│   │   └── linkedin.ts       # Job search API utilities
│   └── types/
│       └── next-auth.d.ts    # NextAuth TypeScript types
├── docs/
│   └── GMAIL_OAUTH_SETUP.md  # Gmail OAuth setup guide
├── vercel.json               # Vercel config (Python rewrites)
├── package.json
└── README.md
```

---

## 🔒 Security Notes

- **Never commit `.env.local`** - It's in `.gitignore`
- **Rotate OAuth secrets** if exposed
- **Use HTTPS** in production
- **Session tokens** are encrypted with `NEXTAUTH_SECRET`

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

_Disclaimer: This is a simulation for demonstration purposes only. Not affiliated with the State of Minnesota._
