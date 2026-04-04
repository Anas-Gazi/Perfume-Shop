# Codebase Guide (Long-Term Maintenance)

This document explains how the project is organized and where to make changes safely.

## Architecture Overview

- `frontend/`: Next.js app (customer + admin UI)
- `backend/`: Express API (auth, products, orders, users, analytics)
- `MySQL`: persistent storage used through a shared query wrapper

Request flow:
1. User opens a frontend route.
2. Frontend calls backend via `frontend/lib/api.js`.
3. Backend middleware validates auth/CORS.
4. Controllers query MySQL and return JSON.
5. Frontend updates Zustand stores and UI.

## Backend Map

- `backend/src/server.js`: startup sequence (env, DB init, HTTP listen)
- `backend/src/app.js`: middleware + route mounting
- `backend/src/config/database.js`: MySQL pool and Postgres-style query compatibility
- `backend/src/middleware/auth.js`: JWT auth and admin guard
- `backend/src/middleware/errorHandler.js`: centralized error output
- `backend/src/controllers/*.js`: business logic per domain
- `backend/src/routes/*.js`: endpoint definitions by domain
- `backend/src/utils/*.js`: reusable helpers (auth, validation, email, uploads)

## Frontend Map

- `frontend/app/`: Next.js route pages
- `frontend/components/`: shared UI blocks (Header, Footer, cards, filters)
- `frontend/lib/api.js`: Axios instance + auth interceptors
- `frontend/lib/authStore.js`: login state and session rehydration
- `frontend/lib/cartStore.js`: persisted cart logic
- `frontend/lib/productStore.js`: product/filter state
- `frontend/lib/socialLinks.js`: social URLs assembled from env vars

## Environment Variables

Backend (`backend/.env`):
- DB config (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)
- auth (`JWT_SECRET`, `JWT_EXPIRE`)
- server (`PORT`, `FRONTEND_URL`, `NODE_ENV`)
- optional (`EMAIL_*`, `CLOUDINARY_*`, `ANALYTICS_COGS_RATIO`)

Frontend (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_FACEBOOK_URL`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_WHATSAPP_TEXT`

## Change Rules (Recommended)

1. Keep route registration in `backend/src/app.js` above `notFoundHandler`.
2. Add input validation in backend before DB writes.
3. Prefer comments for non-obvious logic only; avoid comment noise.
4. Keep frontend API calls through `frontend/lib/api.js` to preserve auth behavior.
5. If modifying order placement, consider DB transactions to prevent partial writes.

## Quick Debug Checklist

1. Backend up? Check `/health`.
2. CORS issue? Verify `FRONTEND_URL` origin list.
3. Auth issue? Inspect token in browser localStorage.
4. Empty analytics? Confirm `/api/analytics/overview` route and admin token.
5. Social links missing? Confirm frontend env values and restart Next.js.
