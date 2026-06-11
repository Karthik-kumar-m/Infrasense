from pydantic import BaseModel, Field


class AIRouteRequest(BaseModel):
    description: str = Field(..., min_length=3)


class AIRouteResponse(BaseModel):
    department: str
