from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.qna import QNA
from app.models.topic import Topic
from app.schemas.qna import QNACreate, QNAOut
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=QNAOut, status_code=201)
def create_qna(
        qna: QNACreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    topic = db.query(Topic).filter(Topic.id == qna.topic_id).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    if topic.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your topic")

    new_qna = QNA(**qna.dict())
    db.add(new_qna)
    db.commit()
    db.refresh(new_qna)
    return new_qna

@router.get("/topics/{topic_id}", response_model=list[QNAOut])
def get_qnas_by_topic(topic_id: int, db: Session = Depends(get_db)):
    return db.query(QNA).filter(QNA.topic_id == topic_id).all()