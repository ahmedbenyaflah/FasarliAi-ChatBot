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
     GMAIL_EMAIL=your_email@gmail.com
     GMAIL_APP_PASSWORD=your_gmail_app_password
     ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app,http://localhost:3000
     MFA_DEBUG_MODE=false
     ```
   - **Note:** Railway automatically sets the `PORT` environment variable - you don't need to set it manually

5. **Set Backend Root Directory and Start Command**
   - Go to **Settings** → **Deploy**
   - Set **Root Directory** to `backend` (this tells Railway where your backend code is)
   - Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Note:** Railway will automatically use the `PORT` environment variable it provides
   - **Alternative:** If you don't set Root Directory, use: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

6. **Deploy Frontend Service**
   - Click **"Add Service"** → **"GitHub Repo"**
   - Select the same repository
   - Railway will auto-detect Next.js

7. **Configure Frontend Environment Variables** ⚠️ **CRITICAL: Set BEFORE first build!**
   - Go to your frontend service → **Variables** tab
   - **IMPORTANT:** These MUST be set BEFORE the first build/deployment
   - Next.js requires these during build time for static page generation
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
- **Root Directory:** `backend` (set in Settings → Deploy)
- **Build Command:** `pip install -r requirements.txt` (auto-detected when root directory is set)
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Note:** Railway automatically provides the `PORT` environment variable

**Required Environment Variables:**
- `GROQ_API_KEY` - Your Groq API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- `GMAIL_EMAIL` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Your Gmail app password (get from https://myaccount.google.com/apppasswords)

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
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly (should be your Railway backend URL, not localhost)
- Check backend CORS includes frontend URL in `ALLOWED_ORIGINS`
- Ensure backend service is running (check Railway logs)
- Verify backend health endpoint: `curl https://your-backend.up.railway.app/api/health`
- Make sure both services have generated public domains (Settings → Networking → Generate Domain)
- Check browser console for CORS errors - if you see CORS errors, update `ALLOWED_ORIGINS` in backend environment variables

### Build Fails
- Check Railway build logs
- Verify all dependencies in `requirements.txt` and `package.json`
- Check for Python/Node version issues

### Email Not Sending
- Verify `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` are set
- Make sure you're using an App Password, not your regular Gmail password
- Get app password from: https://myaccount.google.com/apppasswords
- Test with `/api/test-email-send` endpoint
- **Note:** Railway may block SMTP ports on free tier - if emails fail, consider using Resend API

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

