# Security Setup Guide

## ⚠️ URGENT: Credentials Need to be Rotated

The following credentials were previously committed to Git and **MUST be regenerated immediately**:

### 1. Google Firebase Service Account Key (`fcm.json`)
**Status**: 🔴 COMPROMISED - Must regenerate

**Steps to regenerate:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `golalita-rewards`
3. Navigate to: IAM & Admin → Service Accounts
4. Find service account: `firebase-adminsdk-1hk2u@golalita-rewards.iam.gserviceaccount.com`
5. **Delete the old key** (Key ID: `0eac9a1788c838d98c392115f079c0214782481b`)
6. Create a new key and download the JSON file
7. Save it as `fcm.json` in the project root (this file is gitignored)

### 2. Groq API Key (`src/config/groq.js`)
**Status**: 🔴 COMPROMISED - Must regenerate

**Exposed Key**: `gsk_3f7opL09EMOBQ...` (redacted - key was in Git history)

**Steps to regenerate:**
1. Go to [Groq Console](https://console.groq.com/)
2. Navigate to API Keys section
3. **Revoke the old key** shown above
4. Generate a new API key
5. Copy the example file and update it:
   ```bash
   cp src/config/groq.js.example src/config/groq.js
   ```
6. Replace `YOUR_GROQ_API_KEY_HERE` with your new key

## Setting Up Local Development

After regenerating the credentials:

1. **Copy the template files:**
   ```bash
   cp fcm.json.example fcm.json
   cp src/config/groq.js.example src/config/groq.js
   ```

2. **Update with your new credentials:**
   - Edit `fcm.json` with your new Firebase service account key
   - Edit `src/config/groq.js` with your new Groq API key

3. **Verify files are gitignored:**
   ```bash
   git status
   ```
   You should NOT see `fcm.json` or `src/config/groq.js` in the output.

## Best Practices Going Forward

✅ **DO:**
- Use environment variables for sensitive data when possible
- Keep `.gitignore` updated
- Regularly rotate API keys
- Use different credentials for development/production

❌ **DON'T:**
- Commit API keys or credentials to Git
- Share credentials in Slack, email, or other channels
- Hardcode secrets in source code
- Use production credentials in development

## Files Protected by .gitignore

The following files are now properly excluded from Git:
- `fcm.json` - Firebase credentials
- `src/config/groq.js` - Groq API configuration
- `node_modules/` - Dependencies
- `android/app/build/` - Build artifacts
- `.env` - Environment variables
- And more (see `.gitignore` for full list)

## Need Help?

If you have questions about security setup, contact your team lead or DevOps engineer.
