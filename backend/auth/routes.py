from fastapi import APIRouter, UploadFile, Form, HTTPException
from .utils import hash_password, verify_password
from motor.motor_asyncio import AsyncIOMotorClient
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter()
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["phishing_db"]

# 🔐 USER REGISTRATION WITH FORM & PHOTO
@router.post("/register")
async def register_user(
    name: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    contact_no: str = Form(None),
    gmail: str = Form(None),
    photo: UploadFile = None
):
    # Check for duplicate username
    if await db.users.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed = hash_password(password)

    # Prepare user record
    user_data = {
        "name": name,
        "username": username,
        "password": hashed,
        "contact_no": contact_no,
        "gmail": gmail,
        "photo_filename": photo.filename if photo else None,
    }

    # Optional: Save uploaded photo locally
    if photo:
        os.makedirs("profile_photos", exist_ok=True)
        photo_path = os.path.join("profile_photos", photo.filename)
        with open(photo_path, "wb") as f:
            f.write(await photo.read())

    await db.users.insert_one(user_data)
    return {"message": "User registered successfully"}

# 🔐 USER LOGIN
@router.post("/login")
async def login(user: dict):
    username = user.get("username")
    password = user.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    existing = await db.users.find_one({"username": username})
    if not existing or not verify_password(password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Generate JWT token
    payload = {
        "username": username,
        "role": existing.get("role", "user"),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": username,
            "role": existing.get("role", "user")
        }
    }
