# B Moni frontend

A React and Vite interface for the B Moni API and BMONI sandbox. Peer-lending balances, deposits, contributions, transfers and repayments are sandbox or simulated activity; they do not represent real cash.

## Run locally

```powershell
Copy-Item .env.example .env.local
npm run dev
```

The Vite development server proxies `/api`, `/swagger` and `/health` to `http://localhost:5182` by default. Set `VITE_API_TARGET` if the API listens elsewhere. For a separately hosted frontend, set `VITE_API_BASE_URL` to the backend origin at build time and allow the frontend origin in the API's `ALLOWED_ORIGINS` setting. Do not put BMONI credentials, signer secrets, or other backend secrets in a `VITE_` variable.

## Demo mode

Demo mode is off by default. Set `VITE_DEMO_MODE_ENABLED=true` only when you intentionally want the local simulated client. Nigeria KYC and BMONI account operations always call the connected API and never return simulated success.

## Backend actions available in the interface

- Register and sign in, read the current account, bootstrap data and health status.
- Dashboard, wallet, score, loans, loan detail, assessment, schedule, create request, contribute, withdraw, accept terms and request repayment.
- Wallet deposit and spend requests, pending approval review/confirmation/rejection, transaction filtering and pagination, lender returns.
- BMONI Nigeria sandbox onboarding with both supported test personas, file uploads, balances, transactions, Nigerian bank verification and transfer approval requests.
- Scam checks and assistant questions.

The webhook route is an inbound partner callback and is not a user initiated frontend action. For KYC, use only BMONI sandbox personas and sample documents. The BMONI wallet remains separate from the simulated lending ledger.

## Build and lint

```bash
npm run build
npm run lint
```
