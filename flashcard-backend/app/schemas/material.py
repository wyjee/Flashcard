from pydantic import BaseModel

class MaterialOut(BaseModel):
    id: int
    file_url: str
    file_type: str

    class Config:
        orm_mode = True