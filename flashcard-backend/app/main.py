from fastapi import FastAPI
from app.db.session import engine, Base
from app.models import *
from app.routers import users, topics, qnas

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(topics.router, prefix="/topics", tags=["Topics"])
app.include_router(qnas.router, prefix="/qnas", tags=["QNA"])

@app.get("/")
def root():
    return {"msg": "Flashcard API is running"}