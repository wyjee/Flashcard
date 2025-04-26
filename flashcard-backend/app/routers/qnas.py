from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.qna import QNA
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.qna import QNACreate, QNAUpdate, QNAOut

router = APIRouter()

@router.post("", response_model=QNAOut, status_code=status.HTTP_201_CREATED)
def create_qna(
        qna: QNACreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    new_qna = QNA(
        topic_id=qna.topic_id,
        question=qna.question,
        answer=qna.answer,
    )
    db.add(new_qna)
    db.commit()
    db.refresh(new_qna)
    return new_qna

@router.put("/{qna_id}", response_model=QNAOut)
def update_qna(
        qna_id: int,
        qna_update: QNAUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    qna = db.query(QNA).filter(QNA.id == qna_id).first()
    if not qna:
        raise HTTPException(status_code=404, detail="QNA not found")

    if qna.topic.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your QNA")

    qna.question = qna_update.question
    qna.answer = qna_update.answer
    db.commit()
    db.refresh(qna)
    return qna

@router.delete("/{qna_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_qna(
        qna_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    qna = db.query(QNA).filter(QNA.id == qna_id).first()
    if not qna:
        raise HTTPException(status_code=404, detail="QNA not found")

    if qna.topic.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your QNA")

    db.delete(qna)
    db.commit()
    return None