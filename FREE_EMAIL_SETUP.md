# Free Way to Send Emails to Any Address with Resend

## The Reality

**Resend itself is FREE** (3,000 emails/month, 100/day) ✅  
**But** to send to any email address, you need to verify a domain ⚠️

## Free Domain Options

### Option 1: Free Domain from Freenom (FREE but Limited)

1. **Get a Free Domain:**
   - Go to https://www.freenom.com/
   - Search for available domains (`.tk`, `.ml`, `.ga`, `.cf`, `.gq`)
   - Register for FREE (no credit card needed)

2. **Verify in Resend:**
   - Add the domain in Resend Dashboard
   - Add DNS records to Freenom's DNS settings
   - Verify and start sending!

**Pros:**
- ✅ Completely FREE
- ✅ Works with Resend
- ✅ Can send to any email

**Cons:**
- ⚠️ Some email providers may flag free TLDs as spam
- ⚠️ Less reliable than paid domains
- ⚠️ May have restrictions

### Option 2: Very Cheap Domain (~$1-3/year)

**Best for Production:**

1. **Namecheap First Year Deals:**
   - Visit https://www.namecheap.com/
   - Look for first-year deals (often $0.99-$2.99)
   - Popular options: `.xyz`, `.site`, `.online`

2. **Porkbun:**
   - Visit https://porkbun.com/
   - Very competitive pricing
   - Good first-year deals

**Example:** `.xyz` domain can be as low as **$0.99 for the first year**

## Quick Setup Guide (Using Free Domain)

### Step 1: Get Free Domain from Freenom

1. Go to https://www.freenom.com/
2. Search for a domain (e.g., `myapp.tk`)
3. Select "Get it now" → FREE
4. Complete registration (no payment needed)

### Step 2: Configure DNS in Freenom

1. Log into Freenom
2. Go to "Services" → "My Domains"
3. Click "Manage Domain" → "Management Tools" → "Nameservers"
4. Use Freenom's default nameservers (or configure DNS records)

### Step 3: Add Domain to Resend

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your Freenom domain (e.g., `myapp.tk`)
4. Copy the DNS records Resend provides

### Step 4: Add DNS Records in Freenom

1. In Freenom, go to "Management Tools" → "DNS Management"
2. Add the TXT and MX records from Resend
3. Save changes
4. Wait 5-60 minutes for DNS propagation

### Step 5: Verify in Resend

1. Go back to Resend Dashboard
2. Click "Verify" next to your domain
3. Wait for verification (usually a few minutes)

### Step 6: Update Your Code

```env
# Update your .env file
RESEND_FROM_EMAIL=noreply@myapp.tk
```

**That's it!** Now you can send to any email address for FREE! 🎉

## Alternative: Use Supabase's Built-in Email (Limited)

Supabase has built-in email sending, but it's **very limited**:
- Only 2 emails/hour on free tier
- Only for auth emails (signup, password reset)
- Not suitable for MFA codes

**Not recommended** for your use case.

## Recommendation

**For Testing/Development:**
- Use Freenom free domain (`.tk`, `.ml`, etc.)
- Completely FREE
- Good enough for testing

**For Production:**
- Get a cheap domain ($1-3/year from Namecheap or Porkbun)
- Better deliverability
- More professional
- Still very affordable!

## Cost Summary

| Option | Domain Cost | Resend Cost | Total |
|--------|-------------|-------------|-------|
| Freenom | FREE | FREE | **$0/year** |
| Cheap Domain | $1-3/year | FREE | **$1-3/year** |

Both options allow you to send to **any email address** using Resend's free tier!

