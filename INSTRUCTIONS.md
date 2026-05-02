# Parcel Checker — Local instructions

1. Copy `.env.example` to `.env` and set `LOGIN_PASSWORD` to a secure value.

```sh
cp .env.example .env
# then edit .env and set LOGIN_PASSWORD
```

2. Install and run:

```sh
npm install
npm start
```

3. Open your browser to `http://localhost:3000` and sign in with the password you set in `.env`.

Notes:
- The server checks the submitted password against the `LOGIN_PASSWORD` environment variable (loaded via `dotenv`).
- This is a minimal scaffold for login only; no persistent sessions are implemented yet.
