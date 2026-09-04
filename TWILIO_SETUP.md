# Twilio WhatsApp Production Setup

## 1. Create Twilio Account
- Go to https://www.twilio.com/console
- Sign up for a Twilio account
- Upgrade to Production account (from free trial)

## 2. Get WhatsApp Approved Number
- In Twilio Console, go to **Messaging** → **Try it out** → **Send an SMS**
- Switch to **WhatsApp**
- Request a WhatsApp Business Account integration
- Follow Meta's approval process (usually takes 1-2 business days)
- Once approved, you'll get a WhatsApp-enabled phone number

## 3. Get Your Credentials
In Twilio Console → Account Settings:
- **Account SID**: Find under Account Info
- **Auth Token**: Find under Account Info
- **WhatsApp Number**: Find under Messaging → Services → WhatsApp, look for your approved number

## 4. Add to Vercel Environment Variables
Go to your Vercel project → Settings → Environment Variables:

```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890
```

Replace with your actual values. Keep the + and country code!

## 5. Redeploy
- Push a commit to trigger redeploy
- Or manually redeploy from Vercel dashboard

## 6. Test
- Fill out the quiz
- Enter a WhatsApp number when prompted
- Should receive diagnosis on WhatsApp from YOUR number (not Twilio sandbox)

## 7. Optional: Collect Leads
Currently leads are logged to console. To store them:

### Option A: Telegram Notifications
Modify `/api/store-lead` to send Telegram notification:
```bash
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage \
  -d chat_id=YOUR_CHAT_ID \
  -d text="New lead: $whatsapp"
```

### Option B: Airtable
Modify `/api/store-lead` to save to Airtable:
```javascript
await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    records: [{
      fields: {
        WhatsApp: whatsapp,
        MessageSID: messageSid,
        Timestamp: timestamp,
      }
    }]
  })
});
```

### Option C: Database (Supabase, MongoDB, etc)
Implement your own database storage

## Costs
- WhatsApp messages: $0.0040-0.0180 per message (depending on country)
- Twilio account: ~$1-5/month minimum
- Much cheaper than Meta WhatsApp Business API for small volumes

## Troubleshooting
- "Invalid 'From' parameter": Check TWILIO_WHATSAPP_NUMBER format (must include +)
- "Account not authorized": Make sure you upgraded from trial to production
- "WhatsApp number not approved": Wait for Meta approval (1-2 business days)
