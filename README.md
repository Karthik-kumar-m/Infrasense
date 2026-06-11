# Infrasense - CampusFix

## Frontend (Next.js)

```bash
cd /home/runner/work/Infrasense/Infrasense/Karthik-kumar-m/Infrasense/frontend
npm install
npm run dev
```

## Backend (FastAPI)

```bash
cd /home/runner/work/Infrasense/Infrasense/Karthik-kumar-m/Infrasense/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### API

- `POST /api/route-issue`
  - Request: `{ "description": "Projector not working" }`
  - Response: `{ "department": "IT" }`
