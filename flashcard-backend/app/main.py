from fastapi import FastAPI
from app.db.session import engine, Base
from app.models import *
from app.routers import users, topics, qnas
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

app = FastAPI()
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(topics.router, prefix="/topics", tags=["Topics"])
app.include_router(qnas.router, prefix="/qnas", tags=["QNA"])

@app.get("/")
def root():
    return {"msg": "Flashcard API is running"}