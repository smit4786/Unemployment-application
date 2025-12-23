# Gmail OAuth Setup Guide

## Overview

Enable direct email sending with resume attachments via Gmail API.

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project (or select existing)
3. Name it: `mn-unemployment-platform`

## Step 2: Enable Gmail API

1. Go to **APIs & Services** → **Library**
2. Search for "Gmail API"
3. Click **Enable**

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure consent screen:
   - App name: `MN Unemployment Platform`
   - Support email: Your email
   - Scopes: `gmail.send`
4. Application type: **Web application**
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (dev)
   - `https://unemployment-application.vercel.app` (prod)
   - `https://your-custom-domain.com` (if using custom domain)
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://unemployment-application.vercel.app/api/auth/callback/google` (prod)
7. Click **Create**
8. Save **Client ID** and **Client Secret**

## Step 4: Add Environment Variables

In `.env.local` (and Vercel dashboard):

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Step 5: (Optional) Add NextAuth for OAuth Flow

Install:

```bash
npm install next-auth
```

Then create `/src/app/api/auth/[...nextauth]/route.ts` for Google OAuth.

---

## Current Workaround

The app currently uses `mailto:` links which open the user's default email client with pre-filled content. This works without any OAuth setup but doesn't support file attachments.

## Full Gmail API Implementation

For direct sending with attachments, the API endpoint at `/api/v1/send-email` would need to:

1. Accept OAuth access token from frontend
2. Use Gmail API to compose and send email with attachments
3. Return message ID for tracking

This requires additional frontend work to handle the OAuth flow.
