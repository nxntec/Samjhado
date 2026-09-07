# SamjhaDo Offline MVP

A mobile-first offline prototype for SamjhaDo by NXN Technologies.

## Included
- Screenshot upload and local preview
- Explain This
- Scam Check
- Write Reply
- Fix Error
- English / Hindi / Hinglish demo outputs
- ₹9 unlock placeholder
- Razorpay integration placeholder
- Privacy / Terms / About pages
- Fully static HTML/CSS/JavaScript

## Run locally
Double-click `index.html`.

If browser security blocks any local JavaScript behavior, run a simple local server:

### Python
python -m http.server 8000

Then open:
http://localhost:8000

## Important
This version does NOT upload screenshots or call an AI model.
The next development stage is:

1. Connect a secure server-side AI endpoint.
2. Send screenshot to the vision-capable model.
3. Force structured JSON output:
   - summary
   - risk level
   - risk reasons
   - next steps
   - suggested reply
4. Connect Razorpay checkout.
5. Add server-side payment verification.
6. Add privacy controls and deletion policy.
7. Deploy to chosen hosting and point samjhado.in.

Never put an OpenAI or Razorpay secret key directly in `assets/js/app.js`.
