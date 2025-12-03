# Railway Environment Variables Guide

## ⚠️ Important: Separate Variables for Frontend and Backend Services

You need to set environment variables in **TWO separate services** on Railway:
1. **Frontend Service** (Next.js)
2. **Backend Service** (FastAPI)

---

## Frontend Service Variables

Set these in your **Frontend Service** → Variables tab:

```
NEXT_PUBLIC_SUPABASE_URL=https://fmvudazvwqfuiszomvcu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=https://your-backend-service.up.railway.app
NODE_ENV=production
```

**Important Notes:**
- `NEXT_PUBLIC_BACKEND_URL` must be your Railway backend URL (get it after backend deploys)
- Do NOT include `NEXT_PUBLIC_` prefix for backend variables
- These are public variables that are exposed to the browser

---

## Backend Service Variables

Set these in your **Backend Service** → Variables tab:

```
GROQ_API_KEY=gsk_NAgxyWYOtjqM
SUPABASE_URL=https://fmvudazvwqfuiszomvcu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_EMAIL=your_email@gmail.com
GOOGLE_APP_PASSWORD=your_gmail_app_password
ALLOWED_ORIGINS=https://your-frontend-service.up.railway.app,http://localhost:3000
MFA_DEBUG_MODE=false
```

**Important Notes:**
- `ALLOWED_ORIGINS` must include your frontend Railway URL (update after frontend deploys)
- `GOOGLE_EMAIL` and `GOOGLE_APP_PASSWORD` are for sending verification emails
- Railway automatically sets `PORT` - don't set it manually
- `SUPABASE_URL` is the same as `NEXT_PUBLIC_SUPABASE_URL` but without the `NEXT_PUBLIC_` prefix

---

## Quick Fix for Your Current Setup

Based on your current variables, here's what to change:

### For Frontend Service:
1. **Remove:** `BACKEND_URL` (wrong name)
2. **Add:** `NEXT_PUBLIC_BACKEND_URL=https://your-backend-service.up.railway.app`
3. **Keep:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Remove:** All backend-only variables (GROQ_API_KEY, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_EMAIL, GOOGLE_APP_PASSWORD)

### For Backend Service:
1. **Add:** `SUPABASE_URL=https://fmvudazvwqfuiszomvcu.supabase.co`
2. **Add:** `ALLOWED_ORIGINS=https://your-frontend-service.up.railway.app,http://localhost:3000`
3. **Keep:** `GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_EMAIL`, `GOOGLE_APP_PASSWORD`, `MFA_DEBUG_MODE`
4. **Remove:** All `NEXT_PUBLIC_*` variables (those are frontend-only)

---

## Step-by-Step Fix

1. **Get your Railway URLs:**
   - Deploy both services first
   - Go to each service → Settings → Networking → Generate Domain
   - Copy the URLs

2. **Update Frontend Service Variables:**
   - Remove backend variables
   - Change `BACKEND_URL` to `NEXT_PUBLIC_BACKEND_URL`
   - Set value to your backend Railway URL

3. **Update Backend Service Variables:**
   - Add `SUPABASE_URL` (same as NEXT_PUBLIC_SUPABASE_URL)
   - Add `ALLOWED_ORIGINS` with your frontend URL
   - Remove frontend variables

4. **Redeploy both services** after updating variables

---

## Variable Reference

| Variable | Service | Required | Description |
|----------|---------|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Frontend | ✅ | Backend Railway URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | ✅ | Supabase anon key |
| `SUPABASE_URL` | Backend | ✅ | Same as NEXT_PUBLIC_SUPABASE_URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | ✅ | Supabase service role key |
| `GROQ_API_KEY` | Backend | ✅ | Groq API key for LLM |
| `GOOGLE_EMAIL` | Backend | ✅ | Gmail for sending emails |
| `GOOGLE_APP_PASSWORD` | Backend | ✅ | Gmail app password |
| `ALLOWED_ORIGINS` | Backend | ✅ | CORS allowed origins |
| `MFA_DEBUG_MODE` | Backend | ⚪ | Set to `false` for production |
| `PORT` | Backend | ❌ | Auto-set by Railway |

