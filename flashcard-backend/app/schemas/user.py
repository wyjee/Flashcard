from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    identifier: str             # 아이디 입력: email Or username
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None