from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List

from app.db.session import get_db
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicOut
from app.routers.auth import get_current_user, get_optional_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=TopicOut, status_code=201)
def create_topic(
        topic: TopicCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    new_topic = Topic(
        title=topic.title,
        description=topic.description,
        user_id=current_user.id,
        is_public=topic.is_public,
    )
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)
    return new_topic

@router.get("/", response_model=List[TopicOut])
def get_topics(
        db: Session = Depends(get_db),
        current_user: Optional[User] = Depends(get_optional_user)
):
    if current_user:
        # 로그인 시, 작성한 토픽 + 퍼블릭 토픽
        return db.query(Topic).filter(Topic.user_id == current_user.id).all()
    else:
        # 로그인 x, 퍼블릭 토픽만.
        return db.query(Topic).filter(Topic.is_public == True).all()

@router.get("/{topic_id}", response_model=TopicOut)
def get_topic_detail(
        topic_id: int,
        db: Session = Depends(get_db)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    return topic