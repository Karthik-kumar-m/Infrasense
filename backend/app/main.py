from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy.exc import SQLAlchemyError

from .ai_router import classify_department
from .db import Base, engine
from .schemas import AIRouteRequest, AIRouteResponse

@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        pass
    yield


app = FastAPI(title="CampusFix API", version="0.1.0", lifespan=lifespan)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/route-issue", response_model=AIRouteResponse)
def route_issue(payload: AIRouteRequest):
    return AIRouteResponse(department=classify_department(payload.description))
