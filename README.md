<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/bc322b87-e7d5-4219-b526-95b5faf3281b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Production notes

- Set `GEMINI_API_KEY` only on the server.
- Set Firebase Admin variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) on the server for verified AI-user quotas.
- Set `VITE_FIREBASE_*` values for the browser Firebase client.
- Do not commit `.env` or service-account JSON files.
- The app uses Gemini 3.8 Flash (`gemini-3.8-flash`) for AI generation.
