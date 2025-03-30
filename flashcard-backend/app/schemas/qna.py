from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.material import MaterialOut

class QNABase(BaseModel):
    question: str
    answer: str

class QNACreate(QNABase):
    topic_id: int

class QNAOut(QNABase):
    id: int
    question: str
    answer: str
    created_at: datetime
    materials: List[MaterialOut] = []

    class Config:
        orm_mode = True