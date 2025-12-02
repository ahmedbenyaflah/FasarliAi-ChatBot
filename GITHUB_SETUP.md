# Uploading FasarliAI to GitHub

Follow these steps to upload your project to GitHub.

## Prerequisites

1. **Git installed** on your computer
   - Check: `git --version`
   - Download: https://git-scm.com/downloads

2. **GitHub account** created
   - Sign up: https://github.com

## Step 1: Initialize Git Repository

Open PowerShell or Command Prompt in your project directory and run:

```bash
cd c:\framework\fasarliai
git init
```

## Step 2: Add All Files

```bash
git add .
```

This will add all files except those in `.gitignore` (like `node_modules`, `venv`, `.env` files).

## Step 3: Create Your First Commit

```bash
git commit -m "Initial commit: FasarliAI project"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `fasarliai` (or your preferred name)
   - **Description**: "FasarliAI - Interactive PDF study assistant with AI chat, quizzes, and flashcards"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fasarliai.git

# Rename main branch (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Note**: If you're using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR_USERNAME/fasarliai.git
```

## Step 6: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that sensitive files (`.env`, `node_modules`, `venv`) are NOT visible

## Authentication

If you're prompted for credentials:

### Option 1: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Use your GitHub username and the token as password when pushing

### Option 2: GitHub CLI
```bash
# Install GitHub CLI, then:
gh auth login
```

### Option 3: SSH Keys
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Use SSH URL for remote: `git@github.com:USERNAME/REPO.git`

## Future Updates

After making changes to your code:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## Quick Command Reference

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Add remote (first time only)
git remote add origin https://github.com/YOUR_USERNAME/fasarliai.git

# Push to GitHub
git push -u origin main

# Check status
git status

# View commit history
git log
```

## Troubleshooting

### "Repository not found" error
- Check that the repository name matches exactly
- Verify you have access to the repository
- Make sure you're using the correct username

### "Authentication failed" error
- Use a Personal Access Token instead of password
- Check that your token has `repo` permissions
- Try using SSH instead of HTTPS

### "Large files" error
- Make sure `node_modules` and `venv` are in `.gitignore`
- If you accidentally committed large files, use `git rm --cached` to remove them

### Want to start fresh?
```bash
# Remove existing git history (careful!)
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```

