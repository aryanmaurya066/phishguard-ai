# 🛡️ Modular AI Phishing Detection System

This FastAPI-based project uses modular AI and heuristics to detect phishing attempts via multiple inputs:

- 📧 Email Text (NLP classification)
- 🧑 Sender Email Analysis (regex & domain patterns)
- 🌐 URL Phishing Classifier (heuristics + VirusTotal)
- 🕸️ Web Page Content Scanner (keyword & form detection)

---

## 📁 Project Structure

```
ai_phishing_detector/
├── main.py                 # FastAPI app entry
├── phishing_model.pkl    # Trained NLP model for email text
├── modules/
│   ├── email_text.py       # Module 1: Email text classification
│   ├── sender_email.py     # Module 2: Sender email analysis
│   ├── url_checker.py      # Module 3: URL classifier (VirusTotal optional)
│   ├── web_content.py      # Module 4: Web content scanner
│   └── combiner.py         # Verdict combiner logic
├── requirements.txt        # Dependencies
├── README.md               # Project instructions
```

---

## 🚀 How to Run the App

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run FastAPI server**:
   ```bash
   uvicorn main:app --reload
   ```

3. **Open in browser**:
   [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Sample API Request (`POST /analyze`)

```json
{
  "email_text": "Click to update your account or it will be closed.",
  "sender_email": "support@paypal-security.com",
  "urls": ["http://paypal-login-alerts.com"],
  "web_content": "<form>Enter your password to continue</form>"
}
```

---

## ✅ Sample Response

```json
{
  "header": {
    "status": "success",
    "status_code": 200,
    "message": "Phishing analysis completed",
    "timestamp": "2025-06-11T18:30:12.000Z",
    "request_id": "a1b2c3d4"
  },
  "result": {
    "verdict": "phishing",
    "score": 8,
    "modules": {
      "email_text": {
        "prediction": "phishing",
        "confidence": 92.1
      },
      "sender_email": {
        "suspicious": true,
        "reason": "Unrecognized domain"
      },
      "urls": [
        {
          "url": "http://paypal-login-alerts.com",
          "prediction": "phishing",
          "virustotal_status": "malicious",
          "local_prediction": "phishing"
        }
      ],
      "web_content": {
        "risk_score": 60,
        "login_form_detected": true,
        "keywords_found": ["login", "password"]
      }
    }
  }
}
```

---

## 🔐 Optional APIs You Can Add

- **VirusTotal**: for live URL threat reports  
- **PhishTank**: for known phishing domains  
- (Add your API keys in `url_checker.py`)

---

## 🧠 Notes

- All fields are optional. You can test just one or many.
- The verdict is based on weighted ensemble scoring.
- Designed to be extendable: more modules can be added easily.