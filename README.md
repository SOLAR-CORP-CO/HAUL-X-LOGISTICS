# HAUL X Logistics

Customer website, enquiry API and secure operations dashboard.

## Architecture
- `apps/web`: customer-facing React + Vite website.
- `backend`: FastAPI service; validates enquiries, writes to Supabase Postgres and exposes protected admin endpoints.
- `apps/admin`: admin dashboard with sign-in, enquiry search/filter and status management.
- `infra/supabase/schema.sql`: database schema with Row Level Security enabled.
- `render.yaml`: Render API deployment blueprint.

## Deploy the database and API
1. Create a Supabase project and run the complete `infra/supabase/schema.sql` in its SQL Editor.
2. Deploy this repository's `render.yaml` on Render. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`, and `CORS_ORIGINS` (comma-separated exact origins for the customer and admin sites). Render generates `JWT_SECRET`.
3. Set `VITE_API_URL` to the deployed API URL in both frontend build environments. Build and deploy `apps/web` and `apps/admin` as separate static sites. Their output directories are `apps/web/dist` and `apps/admin/dist`.
4. Sign in to the admin site using the configured admin email and a long unique password. Keep server secrets in hosting environment settings only.

## API
- `POST /api/enquiries`: public, validated and rate-limited; responds with a reference only after the database insert succeeds.
- `POST /api/admin/login`: admin credential login; returns an eight-hour signed bearer token.
- `GET /api/admin/enquiries`: protected enquiry list.
- `PATCH /api/admin/enquiries/{reference}`: protected status update.
- `GET /`: health check.

The Supabase service-role key is used only by the API and must never be exposed in frontend variables. The database has RLS enabled and no public table policies. Configure exact production CORS origins before launch.

## Local development
Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`.
Customer site: `cd apps/web && npm install && npm run dev`.
Admin: `cd apps/admin && npm install && npm run dev`.

This is an enquiry-management system, not a confirmed booking, payment or live shipment-tracking system. Password reset by email OTP is intentionally not included. If the admin password is lost, update `ADMIN_INITIAL_PASSWORD` in Render and follow the account re-initialization procedure. Before public production launch, add operational monitoring, backups and a review of security controls.
