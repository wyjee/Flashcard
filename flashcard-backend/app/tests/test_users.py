def test_signup_success(client):
    res = client.post("/users/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass"
    })
    print("RESPONSE", res.status_code, res.text)
    assert res.status_code == 201
    assert res.json()["username"] == "testuser"

    db = TestingSessionLocal()
    db.query(User).filter(User.username == username).delete()
    db.commit()
    db.close()

def test_login_success(client):
    res = client.post("/users/login", data={
        "username": "testuser",
        "password": "testpass"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()