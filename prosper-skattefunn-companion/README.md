# Prosper SkatteFUNN Companion

Production-ready, mobile-friendly companion app for SkatteFUNN projects.

## Tech stack
- React + Vite (TypeScript)
- TailwindCSS
- Firebase (Auth, Firestore, Storage)
- React Router, React Hook Form, Zod, date-fns

## Getting started

1. Install dependencies
```bash
npm install
```

2. Start dev server
```bash
npm run dev
```

3. Tailwind is configured via `@import "tailwindcss"` in `src/index.css` and `tailwind.config.js` content globs.

## Firebase configuration
Create a `.env` file in project root with:
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

The app boots with mocked auth and data. Once env is set, you can wire:
- Auth state in `src/contexts/AuthContext.tsx`
- Firestore CRUD in `src/contexts/DataContext.tsx`
- Storage upload in Admin Panel

## App structure
- `src/components` shared UI (Header, ProjectDocuments)
- `src/pages` routes (Dashboard, LogTime, Reflections, OwnerTools, AdminPanel, Documents, Login)
- `src/contexts` AuthProvider, DataProvider
- `src/services` Firebase init
- `src/mock` seed data
- `src/types.ts` domain types

## Roles
- Employee: log hours, view own entries and documents
- Owner: employee + view all entries, add reflections, dashboard
- Admin: owner + upload PDFs, manage objectives/milestones/users

## Commands
- `npm run dev` start
- `npm run build` build
- `npm run preview` preview
- `npm run lint` lint

## Notes
- UI is responsive and mobile-first
- Replace mock logic with Firebase step-by-step
