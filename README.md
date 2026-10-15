# LMONI — Campus Finance & Collective Peer Lending Prototype

> **Smart finance for Nigerian students.**  
> Prototype built faithfully from the approved 26-screen combined UI design reference (`design/references/Gemini_Generated_Image_7hu0h97hu0h97hu0.jpg`).

---

## 🌟 Overview

LMONI is a campus micro-finance and collective peer-to-peer lending web application tailored for Nigerian university students. It addresses emergency academic financing, campus peer pool savings, deterministic credit readiness scoring, and transparent peer loan distribution.

---

## 📱 Implemented Screen Inventory (All 26 Screen Types)

| # | Screen Name | Route | Description & Features |
|---|-------------|-------|------------------------|
| 1 | **Welcome / Splash** | `/welcome` | Brand monogram `LM`, campus illustration, value proposition, "Get Started" and "I already have an account" actions. |
| 2 | **Sign Up** | `/signup` | Campus community registration with input validation, password toggle, Google login demo, and terms links. |
| 3 | **Login** | `/login` | Registered student sign-in with prefilled demo credentials, password visibility toggle, and forgot password link. |
| 4 | **Forgot Password** | `/forgot-password` | Self-service credential recovery with email/phone input, paper airplane illustration, and simulated reset guidance. |
| 5 | **Onboarding: Personal Info** | `/onboarding/personal` | Step 1 of 6: Full name, date of birth, and gender selection with progress indicator. |
| 6 | **Onboarding: Institution Details** | `/onboarding/institution` | Step 2 of 6: Nigerian university affiliation, matriculation/student ID, course, and level. |
| 7 | **Onboarding: Document Verification** | `/onboarding/verification` | Step 3 of 6: Student ID upload dropzone (<= 5MB, JPG/PNG/PDF), ID type selector, remove/replace action. |
| 8 | **Onboarding: Financial Profile** | `/onboarding/financial-profile` | Step 4 of 6: Monthly allowance, typical expenses, and existing obligations with ₦ currency inputs. |
| 9 | **Onboarding: Consent & Privacy** | `/onboarding/consent` | Step 5 of 6: Explicit mandatory checkboxes for terms, financial data usage, and revocability. |
| 10 | **Verification Success** | `/verification/success` | Verified state summary card with student status, university, student ID, and verification timestamp. |
| 11 | **Home Dashboard** | `/home` | Greeting, verified badge, available balance with eye toggle, 4 quick actions (Send, Add Money, Withdraw, More), habits score gauge, and pool teaser. |
| 12 | **Collective Lending Pool** | `/pool` | Total pool value (₦4.55M), contributors (342), active borrowers (298), user contribution card, 3-step guide, and contribution modal. |
| 12b | **Mandatory Pool Terms Gate** | `/pool/terms` | Enforced gating screen before pool access with 9 readable sections, mandatory agreement checkbox, Accept and Decline actions. |
| 13 | **Pool Details & Statistics** | `/pool/statistics` | Interactive SVG growth chart (Jan-May), performance metrics (90% on-time, 2.4% default, 14% p.a.), and active campus members modal. |
| 14 | **Borrow: Apply for a Loan** | `/borrow` | Loan amount input (₦5k-₦100k), suggested quick chips (₦5k, ₦10k, ₦25k, ₦50k), purpose selector, repayment tenure. |
| 15 | **Borrow: Eligibility** | `/borrow/eligibility` | Dynamic transparent limit assessment, positive eligibility banner, loan offer card, and 3-step next actions. |
| 16 | **Borrow: Confirmation** | `/borrow/confirm` | Loan breakdown (principal, interest, monthly repayment), expandable terms accordion, agreement checkbox, and submit action. |
| 17 | **AI Check: Landing** | `/ai-check` | Mascot header, credit readiness intro, benefits list (assessment, health score, insights, tips), and "Check My Readiness" action. |
| 18 | **AI Check: Score** | `/ai-check/score` | 140px SVG circular score gauge (0-100), key factors breakdown (repayment, income stability, expense management, profile), and expandable tips. |
| 19 | **Transaction History** | `/transactions` | Category icons, date/time, amounts (+₦ / -₦), filter chips (All, Income, Expenses), and demo transaction creator. |
| 20 | **Profile & Settings** | `/profile` | Student avatar ("A"), verified student pill, profile menu (Personal, Verification, Support, Settings), and red outlined logout. |
| 21 | **Success State** | `/state/success` | Reusable submission confirmation with green check icon, reference ID, and next actions. |
| 22 | **Error State** | `/state/error` | Reusable failure handler with warning icon, helpful guidance, retry, and home redirect. |
| 23 | **Loading State** | `/state/loading` | Accessible spinner with status message and cancel return button. |
| 24 | **Security / Transaction Status** | `/state/security` | Shield security badge, transaction record receipt, and reviewer quick-test state switcher (Successful, Pending, Failed). |
| 25 | **Notifications** | `/notifications` | Activity notifications list with unread markers, mark all read, clear all, and clean empty state. |
| 26 | **Expandable Terms** | `/terms` | Accessible accordion sections covering Contributions, Loan Terms, Interest, Risks, and Privacy. |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, JavaScript (ES Modules)
- **Styling**: Vanilla CSS with comprehensive Design Tokens (`src/styles/tokens.css` & `src/App.css`)
- **Typography**: Plus Jakarta Sans & JetBrains Mono (Google Fonts)
- **Routing**: Zero-dependency browser-history Router with `popstate` and direct URL support
- **State**: React Context API (`AuthContext`, `AppStateContext`)
- **Backend Ready**: Configurable base client via `VITE_API_BASE_URL` with robust demo simulation fallback

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation & Running Locally

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run ESLint:
   ```bash
   npm run lint
   ```

---

## 🔌 ASP.NET Core Backend Integration

The frontend includes a dedicated API client layer in `src/api/client.js` and dedicated domain modules:

- `src/api/auth.js` -> `/api/auth/signup`, `/api/auth/login`, `/api/auth/forgot-password`
- `src/api/onboarding.js` -> `/api/onboarding/complete`, `/api/onboarding/upload-document`
- `src/api/pool.js` -> `/api/pool/overview`, `/api/pool/statistics`, `/api/pool/terms/accept`
- `src/api/loan.js` -> `/api/loans/eligibility`, `/api/loans/apply`
- `src/api/transactions.js` -> `/api/transactions`
- `src/api/notifications.js` -> `/api/notifications`

To connect to a live ASP.NET Core backend:
1. Copy `.env.example` to `.env` in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=https://localhost:7001/api
   ```
2. When `VITE_API_BASE_URL` is omitted or the backend is offline, the application seamlessly runs in client demo simulation mode.
