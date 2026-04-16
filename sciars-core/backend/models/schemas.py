from pydantic import BaseModel
from typing import Optional

class IssueCreate(BaseModel):
    userId: str
    category: str
    description: str
    imageUrl: Optional[str] = None
    lat: float
    lng: float
    locationText: str


class IssueStatusUpdate(BaseModel):
    status: str
    proofImageUrl: Optional[str] = None


class VerifyIssue(BaseModel):
    verified: bool