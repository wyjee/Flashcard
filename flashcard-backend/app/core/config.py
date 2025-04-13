import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

env_name = os.getenv("ENV", "local")
env_file = f".env.{env_name}"
load_dotenv(dotenv_path=env_file)

class Settings(BaseSettings):
    ENV: str = os.getenv("ENV", "local")
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5432))
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))

    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_ALGORITHM: str = os.getenv("ACCESS_TOKEN_ALGORITHM", "HS256")
    REFRESH_TOKEN_ALGORITHM: str = os.getenv("REFRESH_TOKEN_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

settings = Settings()