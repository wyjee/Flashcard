from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.session import Base

class QNA(Base):
    __tablename__ = "qnas"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    topic = relationship("Topic", back_populates="qnas")
    type = Column(String, default="text")  # 'text' | 'multiple'
    options = Column(JSON, nullable=True)  # 다중 선택 문제 옵션
    correct_answers = Column(JSON, nullable=True)  # 다중 선택 정답
    materials = relationship("Material", back_populates="qna", cascade="all, delete")
    created_at = Column(DateTime, default=datetime.utcnow)
