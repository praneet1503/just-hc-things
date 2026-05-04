# Mailpheus — Local instructions

1. Set `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `API_KEY`, and optionally `API_BASE_URL` in `.env`.

2. Install and run:

```sh
npm install
npm run dev
```

3. Open your browser to `http://localhost:3000` and sign in with the password you set in `.env`.

Notes:
- Next.js loads `.env` automatically.
- The login form posts to a Next route handler that checks both `LOGIN_EMAIL` and `LOGIN_PASSWORD`.
- The dashboard uses server-side diagnostics to verify the listed API routes when `API_BASE_URL` is available.
- Routes with `:id` placeholders are listed as templates because they need a real resource id before they can be called.
