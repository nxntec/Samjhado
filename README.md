# SamjhaDo Trust Refresh

Trust-focused offline UI refresh for SamjhaDo by NXN Technologies.

## What changed
- New trust-first homepage and cleaner logo treatment
- Prominent Login button
- Working offline test-login flow
- Test OTP: `123456`
- One-click free sample that shows a complete result
- Clear "No card needed" and "try before paying" messaging
- Strong safety notice: SamjhaDo never needs OTP / UPI PIN / CVV / password
- Visible NXN Technologies identity
- Clear product limitations instead of fake trust claims
- English / Hindi / Hinglish sample
- Mobile-first responsive layout

## Important
The login is intentionally a UI prototype. It does NOT send an OTP and does NOT create an account.

Uploaded screenshots are only previewed locally in this build. The live AI is not connected.

## Files to replace
For the full new experience replace:
- `index.html`
- `assets/css/style.css`
- `assets/js/app.js`

The JS must also be replaced because the new login and free-sample features need it.

## Test
1. Open `index.html`
2. Click `Try 1 free sample` or `Use our sample screenshot`
3. Change English / Hindi / Hinglish if desired
4. Click `Login`
5. Enter any 10-digit mobile number
6. Use test OTP: `123456`

## Before public launch
- Replace mock login with secure OTP authentication
- Connect the screenshot AI endpoint server-side
- Add actual screenshot-retention/deletion policy
- Add real privacy contact/support details
- Connect Razorpay only after pricing is final
- Never expose AI or Razorpay secret keys in browser JavaScript
