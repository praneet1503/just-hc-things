# just-hc-things

Minimal Next.js login demo for parcel testing.

## Setup

1. Set `LOGIN_EMAIL`, `LOGIN_PASSWORD`, and `API_KEY` in `.env`.
2. If you know the upstream service root, set `API_BASE_URL` too.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

The home page now shows email and password inputs, including a password visibility toggle. The dashboard shows the API route inventory and live verification results whenever `API_BASE_URL` is configured.
