from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime
import uuid

from modules.email_text import analyze_email_text
from modules.sender_email import analyze_sender_email
from modules.url_checker import analyze_urls
from modules.web_content import analyze_web_content
from modules.combiner import combine_results
from modules.web_scrap import analyze_web_content_from_url

from fastapi import APIRouter, Depends, Request
from auth.deps import verify_token


from db import logs_collection

router = APIRouter()

# -------------------
# 📨 Email Analysis Input
# -------------------
class EmailCheck(BaseModel):
    email_text: str | None = None
    sender_email: str | None = None

@router.post("/analyze/email")
async def analyze_email(data: EmailCheck, request: Request,user=Depends(verify_token)):
    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    username = request.headers.get("X-Username", "unknown")

    try:
        if not data.email_text and not data.sender_email:
            raise HTTPException(status_code=400, detail="No email data provided.")

        text_result = analyze_email_text(data.email_text) if data.email_text else None
        sender_result = analyze_sender_email(data.sender_email) if data.sender_email else None

        final_verdict, score = combine_results(text_result, sender_result, [], None)

        result_body = {
            "classification": final_verdict,  # 'phishing' or 'legitimate'
            "is_phishing": final_verdict == "suspicious",
            "score": score,
            "email_text": text_result,
            "sender_email": sender_result
        }

        await logs_collection.insert_one({
            "type": "email_check",
            "timestamp": timestamp,
            "request_id": request_id,
            "username": username,
            "email_text": data.email_text,
            "sender_email": data.sender_email,
            "result": result_body
        })

        return {
            "header": {
                "request_id": request_id,
                "timestamp": timestamp,
                "status": "success",
                "status_code": 200,
                "message": "Email phishing check complete"
            },
            "result": result_body
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        return {
            "header": {
                "request_id": request_id,
                "timestamp": timestamp,
                "status": "error",
                "status_code": 500,
                "message": str(e)
            },
            "result": None
        }

# -------------------
# 🌐 Web Analysis Input
# -------------------
class WebCheck(BaseModel):
    urls: list[str] | None = None
    web_content: str | None = None

@router.post("/analyze/web")
async def analyze_web(data: WebCheck, request: Request,user=Depends(verify_token)):
    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    username = request.headers.get("X-Username", "unknown")


    try:
        if not data.urls and not data.web_content:
            raise HTTPException(status_code=400, detail="No web input provided.")

        url_results = [analyze_urls(url) for url in data.urls] if data.urls else []
        scrap_results = [analyze_web_content_from_url(url) for url in data.urls] if data.urls else []
        content_result = analyze_web_content(data.web_content) if data.web_content else None

        final_verdict, score = combine_results(None, None, url_results, content_result)

        result_body = {
            "classification": final_verdict,  # 'suspicious' or 'legitimate'
            "is_phishing": final_verdict == "suspicious",
            "score": score,
            "urls": url_results,
            "web_content": content_result,
            "scrap_results": scrap_results
        }

        await logs_collection.insert_one({
            "type": "web_check",
            "timestamp": timestamp,
            "request_id": request_id,
            "username": username,
            "urls": data.urls,
            "web_content": data.web_content,
            "result": result_body
        })

        return {
            "header": {
                "request_id": request_id,
                "timestamp": timestamp,
                "status": "success",
                "status_code": 200,
                "message": "Web phishing check complete"
            },
            "result": result_body
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        return {
            "header": {
                "request_id": request_id,
                "timestamp": timestamp,
                "status": "error",
                "status_code": 500,
                "message": str(e)
            },
            "result": None
        }


# @router.get("/analyze/history")
# async def get_user_history(user=Depends(verify_token)):
#     print(user)
    # if not user:
    #     raise HTTPException(status_code=401, detail="Username missing")
    # logs = await logs_collection.find({"username": user})
    # return logs