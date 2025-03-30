def test_create_topic_success(client):
    login = client.post("/users/login", data={
        "username": "testuser",
        "password": "testpass"
    })
    token = login.json()["access_token"]

    res = client.post("/topics", json={
        "title": "테스트 토픽",
        "description": "테스트용 설명",
        "is_public": True
    }, headers={"Authorization": f"Bearer {token}"})

    assert res.status_code == 201
    assert res.json()["title"] == "테스트 토픽"

def test_create_topic_invalid_type(client):
    login = client.post("/users/login", data={
        "username": "testuser",
        "password": "testpass"
    })
    token = login.json()["access_token"]

    res = client.post("/topics", json={
        "title": 1234,  # 숫자 → 문자열 아님
        "description": "올바르지 않은 타입",
        "is_public": True
    }, headers={"Authorization": f"Bearer {token}"})

    assert res.status_code == 422  # Pydantic validation error

def test_topic_has_qnas(client):
    res = client.get("/topics/1")
    data = res.json()
    assert isinstance(data["qnas"], list)
    assert len(data["qnas"]) >= 1  # 최소 1개 이상