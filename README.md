# HAUL X platform starter

A starter foundation for the HAUL X Logistics platform.

## Structure
- `apps/web`: customer-facing React + TypeScript website
- `apps/admin`: admin dashboard UI starter
- `apps/mobile`: Expo / React Native starter
- `backend`: Python FastAPI starter API
- `infra/supabase/schema.sql`: initial database schema sketch
- `docs/ROADMAP.md`: staged implementation plan

## Important
This is a development starter, not a production logistics platform. It currently has no production authentication, persistent database connection, payment processing, verified tracking, or live admin workflows. Do not accept payments or promise live tracking through this starter.

## Run locally
You will need a computer with Node.js and Python installed. This starter is prepared for GitHub upload and future development; uploading it alone does not deploy all services.

### Backend
```bash
cd backend
python -m venv .venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Web
```bash
cd apps/web
npm install
npm run dev
```

See `.env.example` for planned configuration.
