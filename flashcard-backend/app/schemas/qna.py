from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.material import MaterialOut

class QNABase(BaseModel):
    question: str
    answer: str
    type: Optional[str] = "text"
    options: Optional[List[str]] = None
    correct_answers: Optional[List[str]] = None

class QNACreate(QNABase):
    topic_id: int

class QNAUpdate(QNABase):
    pass

class QNAOut(QNABase):
    id: int
    topic_id: int
    question: str
    answer: str
    created_at: datetime
    materials: List[MaterialOut] = []

    class Config:
        orm_mode = True

class MultipleQNACreate(BaseModel):  # topic_id 제거된 유닛
    question: str
    answer: str

class MultiQNACreate(BaseModel):
    qnas: List[MultipleQNACreate]