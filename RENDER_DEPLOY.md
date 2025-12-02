# Quick Start: Deploy to Render

## Prerequisites
- ✅ Code pushed to GitHub/GitLab/Bitbucket
- ✅ Supabase project created
- ✅ Groq API key ready

## Step-by-Step Deployment

### Option 1: Using Blueprint (Easiest - Recommended)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign up/login

2. **Create Blueprint**
   - Click **"New +"** → **"Blueprint"**
   - Connect your Git repository
   - Render will auto-detect `render.yaml`

3. **Review & Apply**
   - Review the two services (backend + frontend)
   - Click **"Apply"**

4. **Set Environment Variables**

   **For Backend Service (`fasarliai-backend`):**
   ```
   GROQ_API_KEY=your_groq_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ALLOWED_ORIGINS=https://fasarliai-frontend.onrender.com,http://localhost:3000
   GOOGLE_EMAIL=your_email@gmail.com (optional)
   GOOGLE_APP_PASSWORD=your_app_password (optional)
   ```

   **For Frontend Service (`fasarliai-frontend`):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(Note: `NEXT_PUBLIC_BACKEND_URL` is automatically set from backend service)*

5. **Wait for Deployment**
   - Backend will deploy first (~5-10 minutes)
   - Frontend will deploy after (~5-10 minutes)
   - Both services will be live!

### Option 2: Manual Service Creation

If Blueprint doesn't work, create services manually:

#### Backend Service
1. **New +** → **Web Service**
2. Connect repository
3. Settings:
   - **Name**: `fasarliai-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set environment variables (see above)
5. Deploy

#### Frontend Service
1. **New +** → **Web Service**
2. Connect same repository
3. Settings:
   - **Name**: `fasarliai-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Set environment variables (see above)
5. **Important**: Update backend's `ALLOWED_ORIGINS` with frontend URL after deployment

## After Deployment

1. **Update Supabase Auth Settings**
   - Go to Supabase → Authentication → URL Configuration
   - **Site URL**: `https://fasarliai-frontend.onrender.com`
   - **Redirect URLs**: `https://fasarliai-frontend.onrender.com/**`

2. **Verify Services**
   - Backend health: `https://fasarliai-backend.onrender.com/api/health`
   - Frontend: `https://fasarliai-frontend.onrender.com`

3. **Test the Application**
   - Sign up/login
   - Upload a PDF
   - Test chat functionality

## Important Notes

⚠️ **Free Tier Limitations:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading for production use

🔒 **Security:**
- Never commit `.env` files
- Use Render's environment variable management
- Keep API keys secure

📝 **CORS:**
- After frontend deploys, update backend's `ALLOWED_ORIGINS` with the actual frontend URL
- Format: `https://frontend-url.onrender.com,http://localhost:3000`

## Troubleshooting

**Backend won't start?**
- Check all environment variables are set
- Verify build logs for errors
- Ensure Python 3.11 is available

**Frontend can't connect to backend?**
- Verify `NEXT_PUBLIC_BACKEND_URL` is set (auto-set if using Blueprint)
- Check backend CORS includes frontend URL
- Ensure backend service is running

**CORS errors?**
- Update `ALLOWED_ORIGINS` in backend environment variables
- Include both production and localhost URLs
- Restart backend service after updating

## Need Help?

Check the full deployment guide in `DEPLOYMENT.md` for more details.

