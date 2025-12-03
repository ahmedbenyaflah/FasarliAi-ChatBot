# Deploying FasarliAI to Railway

This guide will walk you through deploying both the Next.js frontend and FastAPI backend to Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app - free tier available)
2. A Supabase project (for auth and storage)
3. A Groq API key (for LLM functionality)
4. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Quick Start: Deploy with Railway

### Option 1: Deploy from GitHub (Recommended)

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Sign up/login with GitHub

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository

3. **Deploy Backend Service**
   - Railway will auto-detect your project
   - Click **"Add Service"** → **"GitHub Repo"**
   - Select your repository
   - Set **Root Directory** to `backend` (or leave empty if backend is at root)
   - Railway will auto-detect Python and install dependencies

4. **Configure Backend Environment Variables**
   - Go to your backend service → **Variables** tab
   - Add these environment variables:
     ```
     GROQ_API_KEY=your_groq_api_key
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     RESEND_API_KEY=your_resend_api_key
     RESEND_FROM_EMAIL=onboarding@resend.dev
     RESEND_FROM_NAME=FasarliAI
     ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app,http://localhost:3000
     MFA_DEBUG_MODE=false
     PORT=8000
     ```
   - Railway will auto-set `PORT` - you can override if needed

5. **Set Backend Start Command**
   - Go to **Settings** → **Deploy**
   - Set **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Or if backend is root: `uvicorn main:app --host 0.0.0.0 --port $PORT`

6. **Deploy Frontend Service**
   - Click **"Add Service"** → **"GitHub Repo"**
   - Select the same repository
   - Railway will auto-detect Next.js

7. **Configure Frontend Environment Variables**
   - Go to your frontend service → **Variables** tab
   - Add these environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_BACKEND_URL=https://your-backend-service.up.railway.app
     NODE_ENV=production
     ```
   - **Note:** Get your backend URL from Railway dashboard after backend deploys

8. **Update Backend CORS**
   - After frontend deploys, get the frontend URL
   - Update backend's `ALLOWED_ORIGINS` to include frontend URL:
     ```
     ALLOWED_ORIGINS=https://your-frontend-service.up.railway.app,http://localhost:3000
     ```

9. **Generate Public URLs** (Optional)
   - Railway provides private URLs by default
   - To get public URLs, go to **Settings** → **Networking**
   - Click **"Generate Domain"** for both services

## Configuration Details

### Backend Service (FastAPI)

**Build Settings:**
- **Build Command:** `pip install -r backend/requirements.txt` (auto-detected)
- **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

**Required Environment Variables:**
- `GROQ_API_KEY` - Your Groq API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- `RESEND_API_KEY` - Resend API key for emails
- `RESEND_FROM_EMAIL` - Email sender address
- `RESEND_FROM_NAME` - Email sender name (optional)

### Frontend Service (Next.js)

**Build Settings:**
- **Build Command:** `npm install --legacy-peer-deps && npm run build` (auto-detected)
- **Start Command:** `npm start` (auto-detected)

**Required Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_BACKEND_URL` - Your backend service URL

## Railway Features

### Free Tier Benefits
- ✅ $5 free credit monthly (enough for small apps)
- ✅ No credit card required
- ✅ Auto-deploy from GitHub
- ✅ Custom domains support
- ✅ Environment variables management
- ✅ Logs and metrics

### Pricing
- **Free Tier:** $5 credit/month (usually enough for development)
- **Hobby:** $5/month + usage
- **Pro:** $20/month + usage

## Post-Deployment

### 1. Configure Supabase

1. **Update Supabase Auth Settings:**
   - Go to Supabase → Authentication → URL Configuration
   - Add your frontend URL to "Site URL"
   - Add your frontend URL to "Redirect URLs": `https://your-frontend.up.railway.app/**`

2. **Create Storage Bucket:**
   - Go to Storage → Create Bucket
   - Name: `pdfs`
   - Make it private
   - Set file size limit to 50 MB
   - Set allowed MIME types to `application/pdf`

3. **Run Migrations:**
   - Go to SQL Editor in Supabase
   - Run the SQL files from `supabase/migrations/` in order

### 2. Test Your Deployment

1. **Backend Health Check:**
   ```bash
   curl https://your-backend.up.railway.app/api/health
   ```
   Should return: `{"status": "ok"}`

2. **Test Email Configuration:**
   ```bash
   curl https://your-backend.up.railway.app/api/test-email-config
   ```

3. **Frontend:**
   - Visit your frontend URL
   - Try signing up/logging in
   - Test PDF upload

## Troubleshooting

### Backend Won't Start
- Check all environment variables are set
- Verify build logs for errors
- Ensure Python 3.11 is available (Railway auto-detects)

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check backend CORS includes frontend URL
- Ensure backend service is running

### Build Fails
- Check Railway build logs
- Verify all dependencies in `requirements.txt` and `package.json`
- Check for Python/Node version issues

### Email Not Sending
- Verify `RESEND_API_KEY` is set
- Check `RESEND_FROM_EMAIL` is correct
- Test with `/api/test-email-send` endpoint
- See `FREE_EMAIL_SETUP.md` for free domain setup

## Custom Domains

Railway supports custom domains:

1. Go to your service → **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain
4. Update DNS records as instructed
5. Railway handles SSL automatically

## Monitoring

- **Logs:** View real-time logs in Railway dashboard
- **Metrics:** CPU, Memory, Network usage
- **Deployments:** View deployment history and rollback if needed

## Need Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Check logs:** Railway dashboard → Your service → Logs tab

