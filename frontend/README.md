# B Moni frontend

A responsive React and Vite frontend for the B Moni Nigerian student finance demo. Balances, loan activity, contributions and approvals are presented as simulated activity; the interface does not imply that demo funds are real.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set `VITE_API_BASE_URL` to the backend origin, for example `https://localhost:7001`. The frontend appends the documented `/api/...` paths itself. Do not put API keys, signing secrets, or other backend credentials in a `VITE_` variable.

## Checks

```bash
npm run build
npm run lint
```

## Backend contract status

The repository contains no .NET API project, controllers, DTO definitions, or `BMoni.http`, so the frontend can only target the routes in the product brief. The response contracts and mutation request DTOs must be checked against the API before connecting a live environment. The UI renders returned records without making up financial figures and strips password, token, secret, key, and credential fields from record views. Demo account emails are read from `GET /api/bootstrap`; passwords are never displayed or stored.

Implemented route groups include authentication/bootstrap, overview, loans, open-loan marketplace and lender returns, pending approvals, advisory tools, and BMONI sandbox balances/activity. The sandbox is labeled separately from peer-lending demo activity. Repayment schedules, terms acceptance, repayments, wallet deposit/spend, sandbox onboarding/verification/transfers, and pagination need their API DTOs and interaction contracts before they can be wired safely.
