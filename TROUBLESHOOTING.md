# Troubleshooting Railway Deployment

## Common Issues and Solutions

### Issue: "Deploy Failed" Error

#### Step 1: Check the Logs
1. Go to your Railway dashboard
2. Click on the failed service (`backend` or `frontend`)
3. Click on **"Logs"** tab
4. Scroll to see the error message

#### Common Error #1: Frontend Build Fails - Missing Environment Variables

**Error:** `NEXT_PUBLIC_SUPABASE_URL is not defined` or similar

**Solution:**
1. Go to your **frontend service**
2. Click **"Variables"** tab
3. Add these environment variables **BEFORE** the build:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_BACKEND_URL=your_backend_url_here
   ```
4. Click **"Redeploy"** or wait for auto-deploy

#### Common Error #2: Backend Build Timeout

**Error:** Build takes too long or times out

**Solution:**
The backend has heavy dependencies (sentence-transformers, faiss-cpu). Try:
1. Check Railway build logs for specific errors
2. Verify all dependencies in `requirements.txt` are correct
3. Consider upgrading to a paid plan if build consistently times out

#### Common Error #3: Python Version Error

**Error:** `Python version 3.11.0 not found` or similar

**Solution:**
Railway auto-detects Python version. If issues:
1. Check `backend/runtime.txt` contains `python-3.11.0`
2. Or manually set Python version in Railway service settings

#### Common Error #4: Backend Can't Start

**Error:** `Module not found` or import errors

**Solution:**
1. Check that all environment variables are set in backend service:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Check the build logs to see if all packages installed correctly
3. Verify `requirements.txt` is in the `backend` directory

#### Common Error #5: Frontend Can't Connect to Backend

**Error:** CORS errors or connection refused

**Solution:**
1. Make sure backend service is **Live** first
2. Get the backend URL from Railway dashboard
3. Update frontend's `NEXT_PUBLIC_BACKEND_URL` environment variable
4. Update backend's `ALLOWED_ORIGINS` to include frontend URL:
   ```
   ALLOWED_ORIGINS=https://your-frontend.up.railway.app,http://localhost:3000
   ```
5. Redeploy backend service

#### Common Error #6: Email Not Sending on Railway

**Error:** MFA emails not being sent, or 403 error from Resend

**Solution:**
1. **Check Resend API Key:**
   - Verify `RESEND_API_KEY` is set in Railway dashboard
   - Get your API key from https://resend.com/api-keys
   
2. **Free Tier Limitation:**
   - With `onboarding@resend.dev`, you can only send to your verified Resend account email
   - To send to any email address, verify your domain at https://resend.com/domains
   - After verification, update `RESEND_FROM_EMAIL` to use your domain
   
3. **Test Email Endpoint:**
   - After deployment, test: `POST https://your-backend.up.railway.app/api/test-email-send`
   - Check the response for detailed error messages
   
4. **Verify Configuration:**
   - Check: `GET https://your-backend.up.railway.app/api/test-email-config`
   - Should show `RESEND_API_KEY_set: true`

**Note:** Resend API uses HTTP (not SMTP), so it works perfectly on Railway without any port blocking issues.

## Step-by-Step Fix for Current Failure

### Option A: Fix via Railway Dashboard (Recommended)

1. **Check which service failed:**
   - Click on `backend` → Check logs
   - Click on `frontend` → Check logs

2. **If Frontend Failed:**
   - Go to `frontend` → Variables
   - Add missing environment variables (see above)
   - Click "Redeploy"

3. **If Backend Failed:**
   - Go to `backend` → Variables  
   - Add missing environment variables:
     - `GROQ_API_KEY`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `RESEND_API_KEY`
     - `RESEND_FROM_EMAIL`
     - `ALLOWED_ORIGINS`
   - Click "Redeploy"

4. **After both are Live:**
   - Update backend's `ALLOWED_ORIGINS` with frontend URL
   - Update frontend's `NEXT_PUBLIC_BACKEND_URL` with backend URL
   - Test the application

### Option B: Delete and Redeploy

1. **Delete the Project:**
   - Go to Railway dashboard → Your project
   - Settings → Delete Project

2. **Set Environment Variables First:**
   - Note down all your environment variable values
   - You'll need to set them again

3. **Redeploy:**
   - Create new project
   - Connect GitHub repository
   - **IMPORTANT:** Set environment variables BEFORE first deploy
   - Deploy services

## Quick Checklist

Before deploying, make sure you have:
- [ ] Supabase project created
- [ ] Supabase URL and keys ready
- [ ] Groq API key ready
- [ ] Resend API key ready
- [ ] All environment variables written down

During deployment:
- [ ] Set backend environment variables BEFORE first deploy
- [ ] Set frontend environment variables BEFORE first deploy
- [ ] Wait for backend to be Live before setting frontend's `NEXT_PUBLIC_BACKEND_URL`
- [ ] Update `ALLOWED_ORIGINS` after both are Live

## Still Having Issues?

1. **Check Railway Status:** https://status.railway.app
2. **Review Full Logs:** Look for specific error messages in Railway dashboard
3. **Verify Git Repository:** Make sure latest code is pushed
4. **Check Dependencies:** Ensure `package.json` and `requirements.txt` are correct
5. **Railway Discord:** Join https://discord.gg/railway for community support

## Need More Help?

Share the specific error message from the logs, and I can help troubleshoot further!
