from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # 예: image, video, gif

    qna_id = Column(Integer, ForeignKey("qnas.id"), nullable=False)
    qna = relationship("QNA", back_populates="materials")