# AI Money Maker

An AI-powered web application that lets users generate text (GPT-4) and images (DALL·E 3) through a simple web interface.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your real values

# 3. Start the server
npm start
# or, for development with auto-reload:
npm run dev
```

The server starts on port `5000` by default (configurable via the `PORT` env var) and serves the static frontend from the `public/` directory.

## Environment Variables

Copy `.env.example` to `.env` and fill in the following values:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string (e.g. from MongoDB Atlas) |
| `OPENAI_API_KEY` | OpenAI API key — [get one here](https://platform.openai.com/api-keys) |
| `JWT_SECRET` | Secret used to sign JWT tokens — use a long, random string |
| `STRIPE_KEY` | Stripe secret key — [get one here](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PRICE_ID` | Stripe Price ID for the subscription product (e.g. `price_xxxx`) |
| `SITE_URL` | Public URL of the deployed site, no trailing slash (e.g. `https://your-app.onrender.com`) |
| `PORT` | Port the server listens on (defaults to `5000`) |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | Health check |
| `POST` | `/api/auth/signup` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Log in and receive a JWT |
| `POST` | `/api/generate` | Bearer JWT | Generate text or image via OpenAI |
| `POST` | `/api/stripe/checkout` | Bearer JWT | Create a Stripe checkout session |
| `POST` | `/api/stripe/webhook` | Stripe signature | Stripe webhook handler |

### Auth header format

Protected endpoints expect an `Authorization: Bearer <token>` header where `<token>` is the JWT returned by signup/login.

## Deploying to Render

1. Push this repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) connected to your repo.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add all environment variables from the table above in the Render dashboard.
6. Add your Render service URL as the `SITE_URL` env var.

## Project Structure

```
├── server.js           # Express entry point
├── routes/
│   ├── auth.js         # Signup / Login
│   ├── generate.js     # OpenAI text & image generation
│   └── stripe.js       # Stripe checkout & webhook
├── models/
│   └── User.js         # Mongoose user schema
├── public/             # Static frontend (no build step)
│   ├── index.html      # Landing page
│   ├── signup.html     # Signup form
│   ├── login.html      # Login form
│   ├── dashboard.html  # AI generation dashboard
│   ├── success.html    # Stripe payment success page
│   └── cancel.html     # Stripe payment cancelled page
├── .env.example        # Environment variable template
└── package.json
```
