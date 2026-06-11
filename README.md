# Infrasense - CampusFix

## Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### API

- `POST /api/route-issue`
  - Request: `{ "description": "Projector not working" }`
  - Response: `{ "department": "IT" }`
