from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.qna import QNAOut

class TopicBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: Optional[bool] = True

class TopicCreate(TopicBase):
    pass

class TopicOut(TopicBase):
    id: int
    title: str
    description: Optional[str] = None
    is_public: bool
    created_at: datetime
    qnas: List[QNAOut] = []

    class Config:
        orm_mode = True

class TopicWithQnaOut(BaseModel):
    id: int
    title: str
    description: str
    is_public: bool
    qnas: List[QNAOut]

    class Config:
        from_attributes = True