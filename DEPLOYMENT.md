# Deploying FasarliAI to Render

This guide will walk you through deploying both the Next.js frontend and FastAPI backend to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A Supabase project (for auth and storage)
3. A Groq API key (for LLM functionality)
4. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository. Render will automatically deploy from your repository.

## Step 2: Deploy the Backend (FastAPI)

1. **Create a new Web Service** in Render:
   - Go to your Render dashboard
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure the Backend Service**:
   - **Name**: `fasarliai-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Region**: Choose the closest region to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or set to `backend` if deploying from subdirectory)
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables** (in the Render dashboard):
   ```
   GROQ_API_KEY=your_groq_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ALLOWED_ORIGINS=https://your-frontend-url.onrender.com,http://localhost:3000
   GOOGLE_EMAIL=your_email@gmail.com (optional, for MFA emails)
   GOOGLE_APP_PASSWORD=your_app_password (optional, for MFA emails)
   MFA_DEBUG_MODE=false
   PORT=10000 (Render will set this automatically, but you can specify)
   ```

4. **Save and Deploy**: Click "Create Web Service" and wait for the build to complete.

5. **Note the Backend URL**: After deployment, copy the service URL (e.g., `https://fasarliai-backend.onrender.com`)

## Step 3: Deploy the Frontend (Next.js)

1. **Create a new Web Service** in Render:
   - Click "New +" → "Web Service"
   - Connect the same repository

2. **Configure the Frontend Service**:
   - **Name**: `fasarliai-frontend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Same as backend (for lower latency)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables** (in the Render dashboard):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BACKEND_URL=https://fasarliai-backend.onrender.com
   NODE_ENV=production
   ```

4. **Update Backend CORS**: Go back to your backend service and update the `ALLOWED_ORIGINS` environment variable to include your frontend URL:
   ```
   ALLOWED_ORIGINS=https://fasarliai-frontend.onrender.com,http://localhost:3000
   ```

5. **Save and Deploy**: Click "Create Web Service" and wait for the build to complete.

## Step 4: Using render.yaml (Alternative Method)

If you prefer using the `render.yaml` file:

1. **Push render.yaml** to your repository root
2. **Go to Render Dashboard** → "New +" → "Blueprint"
3. **Connect your repository** and Render will automatically detect the `render.yaml` file
4. **Review the services** and click "Apply"
5. **Set environment variables** for both services in the Render dashboard (as described above)

## Step 5: Configure Supabase

1. **Update Supabase Auth Settings**:
   - Go to your Supabase project → Authentication → URL Configuration
   - Add your frontend URL to "Site URL": `https://fasarliai-frontend.onrender.com`
   - Add your frontend URL to "Redirect URLs": `https://fasarliai-frontend.onrender.com/**`

2. **Create Storage Bucket** (if not already done):
   - Go to Storage → Create Bucket
   - Name: `pdfs`
   - Make it private
   - Set file size limit to 50 MB
   - Set allowed MIME types to `application/pdf`

3. **Run Migrations**:
   - Go to SQL Editor in Supabase
   - Run the SQL files from `supabase/migrations/` in order

## Step 6: Verify Deployment

1. **Check Backend Health**: Visit `https://fasarliai-backend.onrender.com/api/health`
   - Should return: `{"status": "ok"}`

2. **Check Frontend**: Visit `https://fasarliai-frontend.onrender.com`
   - Should load the application

3. **Test Authentication**: Try signing up/logging in
4. **Test PDF Upload**: Upload a PDF and verify it processes correctly

## Important Notes

### Free Tier Limitations

- **Render Free Tier**: Services spin down after 15 minutes of inactivity
- **First Request**: May take 30-60 seconds to wake up
- **Upgrade**: Consider upgrading to a paid plan for production use

### Environment Variables Security

- Never commit `.env` files to your repository
- Use Render's environment variable management
- Keep sensitive keys secure

### CORS Configuration

The backend now supports multiple origins via the `ALLOWED_ORIGINS` environment variable. Format:
```
ALLOWED_ORIGINS=https://frontend1.onrender.com,https://frontend2.onrender.com,http://localhost:3000
```

### Database Considerations

- The backend uses in-memory storage for vector stores (not persistent)
- For production, consider using a persistent vector database (e.g., Pinecone, Weaviate, or Supabase with pgvector)
- Chat histories are also in-memory and will be lost on restart

### Monitoring

- Check Render logs for any errors
- Monitor service health in the Render dashboard
- Set up alerts for service failures

## Troubleshooting

### Backend won't start
- Check that all environment variables are set
- Verify the build command completes successfully
- Check logs for Python import errors

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check backend CORS settings include frontend URL
- Ensure backend service is running

### CORS errors
- Update `ALLOWED_ORIGINS` in backend environment variables
- Include both production and development URLs
- Restart the backend service after updating

### Build failures
- Check Node.js/Python version compatibility
- Verify all dependencies are in `package.json` and `requirements.txt`
- Review build logs for specific errors

## Next Steps

- Set up custom domains for both services
- Configure SSL certificates (automatic with Render)
- Set up monitoring and alerts
- Consider upgrading to paid plans for better performance
- Implement persistent storage for vector stores and chat histories

