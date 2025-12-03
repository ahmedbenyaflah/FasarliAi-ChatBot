# How to Send Emails to Any Address with Resend

## Current Limitation

With Resend's free tier using `onboarding@resend.dev`, you can **only send emails to your verified Resend account email** (the email you used to sign up for Resend).

To send verification emails to **any email address** (like your users' emails), you need to verify your own domain.

## Step-by-Step: Verify Your Domain in Resend

### Step 1: Get a Domain (FREE or Very Cheap Options)

You need a domain name (e.g., `yourdomain.com`). Here are your options:

#### Option A: Free Domain Services (Limited Availability)
- **Freenom** (https://www.freenom.com/) - Free `.tk`, `.ml`, `.ga`, `.cf` domains
  - ⚠️ **Note:** Some email providers may block these free TLDs
  - ⚠️ **Reliability:** Can be less reliable than paid domains
  - ✅ **Cost:** FREE

#### Option B: Very Cheap Domains (~$1-3/year)
- **Namecheap** (https://www.namecheap.com/) - First year deals from $0.99/year
- **Porkbun** (https://porkbun.com/) - Very cheap first-year prices
- **Cloudflare Registrar** (https://www.cloudflare.com/products/registrar/) - At-cost pricing (~$8-10/year)
- **Google Domains** (https://domains.google/) - ~$12/year

#### Option C: Use Existing Domain
- If you already own any domain, you can use it with Resend
- No need to buy a new one!

**Recommendation:** For production, use a cheap paid domain ($1-3/year) for better reliability. For testing, you can try a free Freenom domain.

### Step 2: Add Domain in Resend

1. **Go to Resend Dashboard:**
   - Visit https://resend.com/domains
   - Sign in to your Resend account

2. **Add Your Domain:**
   - Click **"Add Domain"** button
   - Enter your domain (e.g., `yourdomain.com`)
   - Click **"Add"**

3. **Resend will show you DNS records to add:**
   - You'll see records like:
     ```
     Type: TXT
     Name: @
     Value: resend-verification=abc123...
     ```
     ```
     Type: MX
     Name: @
     Value: feedback-smtp.resend.com
     Priority: 10
     ```
     ```
     Type: TXT
     Name: resend._domainkey
     Value: (long DKIM key)
     ```

### Step 3: Add DNS Records to Your Domain

1. **Go to your domain registrar** (where you bought the domain)
2. **Find DNS Management** (usually under "DNS Settings" or "Advanced DNS")
3. **Add the DNS records** that Resend provided:
   - Add each TXT record
   - Add the MX record
   - Save changes

4. **Wait for DNS propagation** (usually 5-60 minutes, can take up to 24 hours)

### Step 4: Verify Domain in Resend

1. **Go back to Resend Dashboard** → Domains
2. **Click "Verify"** next to your domain
3. **Wait for verification** (usually takes a few minutes after DNS propagates)
4. **Status will change to "Verified"** ✅

### Step 5: Update Your Environment Variables

Once your domain is verified, update your `.env` file:

```env
# Before (only sends to your verified email)
RESEND_FROM_EMAIL=onboarding@resend.dev

# After (can send to any email)
RESEND_FROM_EMAIL=noreply@yourdomain.com
# or
RESEND_FROM_EMAIL=hello@yourdomain.com
# or any email using your verified domain
```

**For Render deployment**, update the environment variable in Render Dashboard:
- Go to your backend service → Environment
- Update `RESEND_FROM_EMAIL` to `noreply@yourdomain.com` (or any email using your domain)
- Save and redeploy

## That's It! 🎉

Once your domain is verified and `RESEND_FROM_EMAIL` is updated, your code will automatically send verification emails to **any email address** - no code changes needed!

## Testing

After updating `RESEND_FROM_EMAIL`:

1. **Test locally:**
   ```bash
   # Update your .env file
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   
   # Restart your backend
   # Then test:
   curl -X POST http://localhost:8000/api/test-email-send
   ```

2. **Update test recipient** (optional):
   - Edit `backend/main.py` line ~785
   - Change `test_recipient` to any email you want to test with

3. **Test on Railway:**
   ```bash
   curl -X POST https://your-backend.up.railway.app/api/test-email-send
   ```

## Quick Reference

**Current Setup (Free Tier - Limited):**
- ✅ Works on Render (no SMTP blocking)
- ✅ Free: 3,000 emails/month
- ❌ Can only send to your verified Resend account email

**After Domain Verification:**
- ✅ Works on Render (no SMTP blocking)
- ✅ Free: 3,000 emails/month
- ✅ Can send to **any email address**
- ✅ Professional: emails come from your domain

## Need Help?

- **Resend Documentation:** https://resend.com/docs
- **Resend Support:** support@resend.com
- **DNS Issues:** Contact your domain registrar's support

