from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional

from passlib.context import CryptContext

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserUpdate, UserLogin
from app.utils.auth import (
    verify_password,
    create_access_token,
    decode_access_token
)

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
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> User:
    username = decode_access_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def get_optional_user(
        token: Optional[str] = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None

    username = decode_access_token(token)
    if not username:
        return None

    user = db.query(User).filter(User.username == username).first()
    return user

# --------------------------------------------------
# 회원가입
# --------------------------------------------------

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user.username) | User.email == user.email
    ).first()
    if existing_user:
        if existing_user.username == user.username
            raise HTTPException(status_code=400, detail="Username already exists")
        if existing_user.email == user.email
            raise HTTPException(status_code=400, detail="Email already exists")

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
        (form_data: OAuth2PasswordRequestForm = Depends),
        db: Session = Depends(get_db)
):
    from sqlalchemy import or_

    user = db.query(User).filter(
        or_(
            User.username == form_data.username,
            User.email == form_data.username
        )
    ).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

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