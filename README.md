# Minnesota Unemployment Platform (Simulation)

A modern, user-friendly simulation of the Minnesota Unemployment Insurance application process. This MVP demonstrates a streamlined UX for applying for benefits, checking eligibility, and managing weekly claims.

[View on GitHub](https://github.com/habibshahid2013/Unemployment-application)

## Key Features

- **Eligibility Checker**: Interactive wizard to help users understand qualification requirements.
- **Smart Application**: Multi-step form with validation and progress saving (mocked).
- **Dashboard**: Real-time status tracking, notifications, and gamified "Profile Strength".
- **Weekly Requests**: Guided workflow for certifying weekly eligibility and earnings.
- **Job Search Integration**: Built-in tool to find and apply for jobs via LinkedIn (Mock Service).
- **Admin Interface**: `/admin` portal for caseworkers to review and approve applications.
- **Mobile Friendly**: Fully responsive design with a touch-friendly navigation drawer.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material UI (MUI) v6
- **Language**: TypeScript
- **Persistence**:
  - In-Memory Store (Dev/Demo)
  - Google Cloud Firestore (Production Ready - requires config)
- **Styling**: Custom "MN Blue" Theme

## Getting Started

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/habibshahid2013/Unemployment-application.git
    cd mn-unemployment-platform
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1.  Push code to GitHub (Done!).
2.  Import the project into Vercel.
3.  Click **Deploy**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhabibshahid2013%2FUnemployment-application)

## Google Cloud / Firebase Setup (Optional)

To enable persistent storage, create a `.env.local` file with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
...
```

If these are missing, the application defaults to an in-memory store that resets on server restart.

## LinkedIn Jobs API (Optional)

To enable real job search data instead of mock data, subscribe to the **LinkedIn Jobs Search** API on RapidAPI and add your key:

```env
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
```

## Demo Flow

1.  **Log In**: Use any email/password (or Google Sign-In).
2.  **Apply**: Complete the application form.
3.  **Admin**: Go to `/admin` to approve the application.
4.  **Weekly Request**: Return to Dashboard and file a weekly claim.
5.  **Job Search**: Use the "Job Search" tab to log work search activities.

---

_Disclaimer: This is a simulation for demonstration purposes only. Not affiliated with the State of Minnesota._
