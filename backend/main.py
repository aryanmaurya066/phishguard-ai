from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from auth.routes import router as auth_routes
from admin.routes import router as admin_routes
from analyze.routes import router as analyze_routes
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")

# FastAPI app
app = FastAPI(title="Modular AI Phishing Detector")

app.include_router(auth_routes)
app.include_router(admin_routes)
app.include_router(analyze_routes)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGINS],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)