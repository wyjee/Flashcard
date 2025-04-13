from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from fastapi.responses import JSONResponse

from passlib.context import CryptContext
from sqlalchemy import or_

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserUpdate, UserLogin
from app.utils.auth import (
    verify_password,
    create_access_token,
    decode_access_token,
    create_refresh_token,
    decode_refresh_token
)
from app.core.config import settings

import json
from app.core.redis import redis_client as redis

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

# --------------------------------------------------
# 테스트
# --------------------------------------------------

@router.get("/test")
def test_user():
    return {"msg": "Hello, User!"}

# --------------------------------------------------
# 인증
# --------------------------------------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def get_current_user(
        request: Request,
        token: Optional[str] = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> User:
    if not token:
        token = request.cookies.get("access_token")

    username = decode_access_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")

    cached_user = redis.get(f"user:{username}")
    if cached_user:
        user_data = json.loads(cached_user)
        return UserOut(**user_data)  # or return Pydantic user schema

    # fallback
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def get_optional_user(
        request: Request,
        token: Optional[str] = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        return None

    username = decode_access_token(token)
    if not username:
        return None

    user = db.query(User).filter(User.username == username).first()
    return user

@router.post("/refresh")
def refresh_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        # Redis에 있는지 확인
        stored_token = redis.get(username)
        if not stored_token or stored_token.decode() != refresh_token:
            raise HTTPException(status_code=403, detail="Invalid or expired refresh token")

        # 새 access token 발급
        new_token = create_access_token({"sub": username})
        response = JSONResponse(content={"msg": "Refreshed"})
        response.set_cookie("access_token", new_token, httponly=True)
        return response

    except JWTError:
        raise HTTPException(status_code=401, detail="Refresh token error")

# --------------------------------------------------
# 회원가입
# --------------------------------------------------

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        field = "Username" if existing_user.username == user.username else "Email"
        raise HTTPException(status_code=400, detail=f"{field} already exists")

    hashed_pw = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --------------------------------------------------
# 로그인
# --------------------------------------------------

@router.post("/login")
def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        or_(
            User.username == form_data.username,
            User.email == form_data.username
        )
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    # 토큰 발급
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})

    # Redis에 유저 정보 저장
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }
    redis.set(f"user:{user.username}", json.dumps(user_data), ex=3600)

    # Redis에 refresh_token 저장
    redis.set(f"refresh_token:{user.username}", refresh_token, ex=7 * 24 * 3600)

    # 쿠키에 토큰 저장
    response = JSONResponse(content={"msg": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=7 * 24 * 3600,
    )

    return response

# --------------------------------------------------
# 로그아웃
# --------------------------------------------------

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    redis.delete(f"user:{current_user.username}")
    redis.delete(current_user.username)
    response = JSONResponse(content={"msg": "Logged out"})
    response.delete_cookie("access_token")
    return response

# --------------------------------------------------
# 유저 정보
# --------------------------------------------------

@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserOut)
def update_me(
        update: UserUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if update.username:
        current_user.username = update.username
    if update.email:
        raise HTTPException(status_code=400, detail="Email cannot be updated")

    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=204)
def delete_me(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
    return

