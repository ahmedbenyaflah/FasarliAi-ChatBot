# Railway Clean Setup - Step by Step

## 🧹 Clean Start - Remove Docker, Use Auto-Detection

The Docker build is timing out because ML dependencies take too long to install. Railway's auto-detection is faster and more reliable.

---

## Step 1: Clean Up Files

✅ **Already done:**
- Removed `backend/Dockerfile` (causing timeouts)
- Removed `backend/.dockerignore` (not needed)
- Cleaned `requirements.txt` (removed unused deps)

**Files you should have:**
- ✅ `backend/requirements.txt` (cleaned)
- ✅ `backend/runtime.txt` (with `python-3.11`)
- ✅ `backend/main.py`
- ✅ `backend/railway.json` (optional, but helpful)

---

## Step 2: Commit and Push Clean Code

```bash
git add .
git commit -m "Clean setup: Remove Dockerfile, use Railway auto-detection"
git push origin main
```

---

## Step 3: Configure Railway Backend Service

### A. Remove Docker Configuration

1. Go to Railway Dashboard → Your Backend Service
2. Click **Settings** → **Deploy**
3. **IMPORTANT:** Make sure **Dockerfile Path** is **EMPTY** (not set)
4. If it's set, clear it and save

### B. Set Root Directory

1. In the same **Settings** → **Deploy** section
2. Set **Root Directory** to: `backend`
3. Save

### C. Set Start Command

1. In the same **Settings** → **Deploy** section
2. Set **Start Command** to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Save

### D. Verify Builder

1. Railway should auto-detect **NIXPACKS** as the builder
2. This is shown in the build logs
3. If it shows "Dockerfile" builder, you need to remove Dockerfile Path

---

## Step 4: Environment Variables

Make sure these are set in **Backend Service** → **Variables**:

```
GROQ_API_KEY=your_groq_key
SUPABASE_URL=https://fmvudazvwqfuiszomvcu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_EMAIL=your_email@gmail.com
GOOGLE_APP_PASSWORD=your_gmail_app_password
MFA_DEBUG_MODE=false
```

**Note:** Don't set `ALLOWED_ORIGINS` yet - we'll add it after frontend deploys.

---

## Step 5: Deploy Backend

1. Railway will automatically detect the push and start building
2. **Watch the build logs** - it should show:
   - "Detected Python"
   - "Installing dependencies"
   - Using NIXPACKS builder (not Docker)

3. **This will take 5-10 minutes** because:
   - `sentence-transformers` downloads large ML models (~500MB)
   - `faiss-cpu` compiles (~200MB)
   - Other dependencies install

4. **Be patient** - Railway's auto-detection handles timeouts better than Docker

---

## Step 6: Generate Backend Domain

1. Once backend deploys successfully
2. Go to **Settings** → **Networking**
3. Click **"Generate Domain"**
4. **Copy the URL** (e.g., `https://backend-production-xxxx.up.railway.app`)

---

## Step 7: Deploy Frontend

1. In Railway project, click **"+ New"** → **"GitHub Repo"**
2. Select the same repository
3. Rename to "Frontend"

### Configure Frontend:

1. **Settings** → **Deploy**:
   - Root Directory: **EMPTY** (or `.`)
   - Start Command: `npm start` (auto-set)

2. **Variables** (set BEFORE first build):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://fmvudazvwqfuiszomvcu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.up.railway.app
   NODE_ENV=production
   ```
   ⚠️ Replace with your actual backend URL from Step 6!

3. **Settings** → **Networking** → **Generate Domain**

---

## Step 8: Update Backend CORS

1. Go back to **Backend Service** → **Variables**
2. Add/Update:
   ```
   ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app,http://localhost:3000
   ```
   Replace with your actual frontend URL!

---

## ✅ Verification Checklist

- [ ] Dockerfile removed from repo
- [ ] Dockerfile Path is EMPTY in Railway settings
- [ ] Root Directory set to `backend`
- [ ] Start Command set correctly
- [ ] Railway shows NIXPACKS builder (not Docker)
- [ ] Backend environment variables set
- [ ] Backend deployed successfully
- [ ] Backend domain generated
- [ ] Frontend environment variables set (with backend URL)
- [ ] Frontend deployed successfully
- [ ] Backend CORS updated with frontend URL

---

## 🔧 Troubleshooting

### Build Still Times Out

**If Railway auto-detection also times out:**

1. **Check build logs** - see where it's failing
2. **Increase timeout** (Railway Pro plan has longer timeouts)
3. **Alternative:** Split dependencies:
   - Create `requirements-core.txt` with essential deps
   - Install core deps first, then ML deps in a second step
   - But this is complex - try auto-detection first!

### Wrong Builder Detected

- Make sure Dockerfile Path is **EMPTY**
- Delete any Dockerfile from the repo
- Railway should auto-detect NIXPACKS

### Still Getting Docker Errors

- Make sure you pushed the code after deleting Dockerfile
- Check that Railway is using the latest commit
- Try redeploying from Railway dashboard

---

## 📝 Key Points

1. **No Dockerfile** - Railway auto-detection is better for ML dependencies
2. **NIXPACKS builder** - Faster and handles timeouts better
3. **Be patient** - ML dependencies take 5-10 minutes to install
4. **Watch logs** - Monitor the build to see progress
5. **Clean setup** - Start fresh, don't mix Docker and auto-detection

---

## 🚀 Quick Command Reference

```bash
# Clean up and commit
git add .
git commit -m "Clean setup: Remove Dockerfile, use Railway auto-detection"
git push origin main

# Then configure Railway:
# 1. Backend: Root Directory = backend, Start Command = uvicorn main:app --host 0.0.0.0 --port $PORT
# 2. Frontend: Root Directory = empty, Start Command = npm start
# 3. Set all environment variables
# 4. Generate domains
# 5. Update CORS
```

