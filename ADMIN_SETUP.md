# Admin Setup Guide

## Setting Admin Claims in Firebase

To grant a user admin access, you need to set a custom claim on their Firebase Auth account.

### Option A: Using Firebase Console (Easiest)
1. Go to Firebase Console → Authentication → Users
2. Find your admin user
3. Click the "Custom claims" button (in the user row)
4. Paste this JSON:
   ```json
   { "admin": true }
   ```
5. Save

### Option B: Using Firebase CLI
```bash
# Install Firebase CLI globally if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set the custom claim
firebase functions:config:set admin.uid="YOUR_USER_UID"

# Or use the Admin SDK in a Cloud Function (see below)
```

### Option C: Cloud Function (Advanced)
Deploy this function to set admin claims programmatically:

```javascript
// Set as a callable Cloud Function
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error('Not authenticated');
  
  const { uid } = data;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true };
});
```

## After Setting Admin Claim

1. The user logs in with their Firebase email/password
2. The app automatically detects the `admin` custom claim
3. They can access the Admin Dashboard without needing a password
