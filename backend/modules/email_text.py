import joblib
import re
from modules.url_checker import analyze_urls  # make sure this import path is correct

model = joblib.load("models/phishing_model.pkl")

# Extract all URLs from email text
def extract_urls(text):
    return re.findall(r'https?://[^\s]+', text)

def analyze_email_text(text: str):
    prediction = model.predict([text])[0]
    confidence = model.predict_proba([text])[0].max()

    # Step 1: Basic classification result
    result = {
        "prediction": prediction,
        "confidence": round(confidence * 100, 2)
    }

    # Step 2: Extract and analyze URLs inside text
    urls = extract_urls(text)
    if urls:
        result["embedded_urls"] = urls
        result["url_analysis"] = [analyze_urls(url) for url in urls]

    return result
