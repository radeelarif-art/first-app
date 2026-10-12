# My Finance PK (میرا فنانس پی کے)

A modern, responsive, offline-first Personal Finance Manager tailored for Pakistan with PKR currency, Urdu & English bilingual support, monthly budgets, savings goals & kameti, loan/khata tracking, and bill reminders.

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-teal?logo=tailwindcss)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-emerald?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 🌟 Key Features

- **PKR Currency & Number Notation**: Pakistani formatting (₨) with toggleable standard and Lakh/Crore notation.
- **Urdu & English with RTL Support**: Full right-to-left layout and typography.
- **100% Offline-First (IndexedDB)**: No server or login needed. All transactions and balances stay private on your device.
- **Interactive Dashboard**: Net worth summary, cashflow trends, and category breakdown charts via Recharts.
- **Accounts & Wallets**: Track Cash, Islamic Banks (Meezan, HBL), and Mobile Wallets (EasyPaisa, JazzCash, SadaPay).
- **Monthly Budgets**: Category limits with warning thresholds and live progress bars.
- **Savings Goals & Kameti**: Track Umrah fund, emergency reserves, and kameti with quick deposit/withdraw options.
- **Udhar / Khata Tracker**: Separate tracking for *Mujhe Lene Hain* (Receivable) and *Mujhe Dene Hain* (Payable) with partial payments.
- **Utility Bill Reminders**: LESCO, K-Electric, SNGPL, PTCL, and rent reminders with 1-click payment logging.
- **Backup & Restore**: Instant JSON backup and restore, plus CSV transaction exports.

---

## 🛠 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
# Open http://localhost:3000
```

---

## 🚀 Production Build

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deploy to Vercel (Free Hosting)

1. Push this repository to your GitHub account (`radeelarif-art/first-app`).
2. Log in to [Vercel](https://vercel.com) using your GitHub account.
3. Click **"Add New..."** ➔ **"Project"**.
4. Import `first-app`.
5. Vercel automatically detects **Vite** framework and uses:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your app will be live on a free HTTPS domain in ~30 seconds!
