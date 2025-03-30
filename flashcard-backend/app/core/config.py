import os
from dotenv import load_dotenv

env_file = ".env.test" if "PYTEST_CURRENT_TEST" in os.environ else ".env"
load_dotenv(dotenv_path=env_file)

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    ENV: str = os.getenv("ENV", "prod")

settings = Settings()
