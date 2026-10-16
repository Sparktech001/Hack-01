# LMoni

LMoni is a responsive frontend for a Nigerian student microfinance and peer-lending demo. The application separates BMONI sandbox activity from the peer-lending demo ledger and labels returned financial activity as simulated.

## Frontend

The React + Vite app lives in [`frontend`](frontend/README.md).

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Configure `VITE_API_BASE_URL` with the backend origin (with or without a trailing `/api`). The app uses API paths under `/api`. Do not add backend keys or secrets to frontend environment variables.

## API integration limits

This repository contains no backend source, controller contracts, DTOs, or `BMoni.http` file. The frontend targets only the routes listed in the product brief and does not substitute fabricated balances or loan data. Request and response DTOs still need verification against the actual backend before enabling a live integration. See the frontend README for implemented and pending route flows.

No live BMONI or Render behavior has been verified.
