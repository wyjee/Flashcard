from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.topic import Topic
from app.models.user import User
from app.models.qna import QNA
from app.routers.auth import get_current_user, get_optional_user
from app.schemas.topic import TopicCreate, TopicOut, TopicWithQnaOut
from app.schemas.qna import MultiQNACreate
# import random
# from pydantic import BaseModel
# import httpx

router = APIRouter()

# class TOEFLImportIn(BaseModel):
#     title: str | None = "TOEFL Vocabulary Test"
#     dataset_url: str | None = None
#     num_choices: int | None = 4
#     limit: int | None = 50
#
#
# _FALLBACK_WORDS = [
#     {"word": "abate", "definition": "to become less intense or widespread"},
#     {"word": "bolster", "definition": "to support or strengthen"},
#     {"word": "candid", "definition": "truthful and straightforward"},
#     {"word": "defer", "definition": "to put off to a later time"},
#     {"word": "elicit", "definition": "to draw out a response"},
#     {"word": "fervent", "definition": "having or displaying passionate intensity"},
#     {"word": "garner", "definition": "to gather or collect"},
#     {"word": "hamper", "definition": "to hinder or impede"},
#     {"word": "imminent", "definition": "about to happen"},
#     {"word": "jovial", "definition": "cheerful and friendly"},
# ]
#
#
# async def _load_dataset(dataset_url: str | None):
#     if dataset_url:
#         async with httpx.AsyncClient(timeout=20) as client:
#             resp = await client.get(dataset_url)
#             resp.raise_for_status()
#             try:
#                 data = resp.json()
#                 if isinstance(data, list) and data and "word" in data[0]:
#                     return data
#             except Exception:
#                 pass
#             lines = resp.text.splitlines()
#             out = []
#             for ln in lines:
#                 if not ln.strip():
#                     continue
#                 parts = ln.split(",", 1)
#                 if len(parts) == 2:
#                     out.append({"word": parts[0].strip(), "definition": parts[1].strip()})
#             if out:
#                 return out
#     return _FALLBACK_WORDS
#
#
# @router.post("/import/toefl")
# async def import_toefl_vocab(
#         payload: TOEFLImportIn = TOEFLImportIn(),
#         db: Session = Depends(get_db),
#         current_user: User = Depends(get_current_user),
# ):
#     words = await _load_dataset(payload.dataset_url)
#     if not words:
#         raise HTTPException(status_code=400, detail="Dataset is empty")
#
#     new_topic = Topic(
#         title=payload.title or "TOEFL Vocabulary Test",
#         description="Auto-generated from dataset",
#         user_id=current_user.id,
#         is_public=False,
#     )
#     db.add(new_topic)
#     db.commit()
#     db.refresh(new_topic)
#
#     defs_pool = [w["definition"] for w in words]
#     random.shuffle(words)
#
#     created = 0
#     for w in words:
#         if payload.limit and created >= payload.limit:
#             break
#         correct = w["definition"]
#         distractors = [d for d in defs_pool if d != correct]
#         random.shuffle(distractors)
#         options = [correct] + distractors[: max((payload.num_choices or 4) - 1, 0)]
#         random.shuffle(options)
#         qna = QNA(
#             topic_id=new_topic.id,
#             question=f"[뜻 고르기] {w['word']}",
#             answer=correct,
#             type="multiple_choice",
#             options=options,
#             correct_answers=[correct],
#         )
#         db.add(qna)
#         created += 1
#
#     db.commit()
#     return {"topic_id": new_topic.id, "created": created}

@router.post("", response_model=TopicOut, status_code=201)
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


@router.post("/{topic_id}/qnas", status_code=201)
def create_multiple_qnas(
        topic_id: int,
        payload: MultiQNACreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    if topic.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your topic")

    updated_list = []
    for qna in payload.qnas:
        new_qna = QNA(
            topic_id=topic_id,
            question=qna.question,
            answer=qna.answer,
            type=qna.type,
            options=qna.options,
            correct_answers=qna.correct_answers
        )
        db.add(new_qna)
        updated_list.append(new_qna)

    db.commit()
    return {"created": updated_list}

@router.get("", response_model=List[TopicOut])
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


@router.get("/{topic_id}", response_model=TopicWithQnaOut)
def get_topic_with_qnas(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).options(selectinload(Topic.qnas)) \
        .filter(Topic.id == topic_id).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    return topic

@router.delete("/{topic_id}", status_code=204)
def delete_topic(
        topic_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    if topic.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your topic")

    db.delete(topic)
    db.commit()
    return