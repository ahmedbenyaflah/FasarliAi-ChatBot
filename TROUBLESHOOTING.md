# Troubleshooting Render Deployment

## Common Issues and Solutions

### Issue: "Deploy Failed" Error

#### Step 1: Check the Logs
1. Go to your Render dashboard
2. Click on the failed service (`fasarliai-backend` or `fasarliai-frontend`)
3. Click on **"Logs"** tab
4. Scroll to see the error message

#### Common Error #1: Frontend Build Fails - Missing Environment Variables

**Error:** `NEXT_PUBLIC_SUPABASE_URL is not defined` or similar

**Solution:**
1. Go to your **frontend service** (`fasarliai-frontend`)
2. Click **"Environment"** tab
3. Add these environment variables **BEFORE** the build:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
4. Click **"Save Changes"**
5. Go to **"Events"** tab → Click **"Manual Deploy"** → **"Deploy latest commit"**

#### Common Error #2: Backend Build Timeout

**Error:** Build takes too long or times out

**Solution:**
The backend has heavy dependencies (sentence-transformers, faiss-cpu). Try:
1. Upgrade to a **Starter** plan ($7/month) for longer build times
2. Or optimize the build by splitting dependencies (not recommended for now)

#### Common Error #3: Python Version Error

**Error:** `Python version 3.11.0 not found` or similar

**Solution:**
The `render.yaml` has been updated. Make sure you:
1. Pull the latest changes from your repository
2. Or manually set `PYTHON_VERSION=3.11` in backend service environment variables

#### Common Error #4: Backend Can't Start

**Error:** `Module not found` or import errors

**Solution:**
1. Check that all environment variables are set in backend service:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Check the build logs to see if all packages installed correctly

#### Common Error #5: Frontend Can't Connect to Backend

**Error:** CORS errors or connection refused

**Solution:**
1. Make sure backend service is **Live** first
2. Get the backend URL (e.g., `https://fasarliai-backend.onrender.com`)
3. Update backend's `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://fasarliai-frontend.onrender.com,http://localhost:3000
   ```
4. Restart the backend service

## Step-by-Step Fix for Current Failure

### Option A: Fix via Render Dashboard (Recommended)

1. **Check which service failed:**
   - Click on `fasarliai-backend` → Check logs
   - Click on `fasarliai-frontend` → Check logs

2. **If Frontend Failed:**
   - Go to `fasarliai-frontend` → Environment
   - Add missing environment variables (see above)
   - Manual Deploy → Deploy latest commit

3. **If Backend Failed:**
   - Go to `fasarliai-backend` → Environment  
   - Add missing environment variables:
     - `GROQ_API_KEY`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Manual Deploy → Deploy latest commit

4. **After both are Live:**
   - Update backend's `ALLOWED_ORIGINS` with frontend URL
   - Test the application

### Option B: Delete and Redeploy

1. **Delete the Blueprint:**
   - Go to Blueprint → Settings → Delete

2. **Set Environment Variables First:**
   - Note down all your environment variable values
   - You'll need to set them again

3. **Redeploy:**
   - Create new Blueprint
   - **IMPORTANT:** Set environment variables BEFORE clicking Apply
   - Then click Apply

## Quick Checklist

Before deploying, make sure you have:
- [ ] Supabase project created
- [ ] Supabase URL and keys ready
- [ ] Groq API key ready
- [ ] All environment variables written down

During deployment:
- [ ] Set backend environment variables BEFORE first deploy
- [ ] Set frontend environment variables BEFORE first deploy
- [ ] Wait for backend to be Live before frontend deploys
- [ ] Update `ALLOWED_ORIGINS` after both are Live

## Still Having Issues?

1. **Check Render Status:** https://status.render.com
2. **Review Full Logs:** Look for specific error messages
3. **Verify Git Repository:** Make sure latest code is pushed
4. **Check Dependencies:** Ensure `package.json` and `requirements.txt` are correct

## Need More Help?

Share the specific error message from the logs, and I can help troubleshoot further!

