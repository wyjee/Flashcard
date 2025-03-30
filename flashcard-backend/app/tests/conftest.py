import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import Base, get_db

# 테스트용 저장소, SQLite.
SQLALCHEMY_TEST_URL = "sqlite:///./test_test.db"

engine = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 실제 DB
@pytest.fixture(scope="session", autouse=True)
def prepare_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.rollback()  # 테스트 후 데이터 제거
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c