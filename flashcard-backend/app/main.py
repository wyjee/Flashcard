from fastapi import FastAPI
from app.core.config import settings
from app.db.session import engine, Base
from app.models import *
from app.routers import auth, topics, qnas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# app.router.redirect_slashes = False

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(topics.router, prefix="/topics", tags=["Topics"])
app.include_router(qnas.router, prefix="/qnas", tags=["QNA"])

@app.get("/")
def root():
    return {"msg": "Flashcard API is running"}