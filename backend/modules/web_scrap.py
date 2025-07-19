import requests
from bs4 import BeautifulSoup

def analyze_web_content_from_url(url: str):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code != 200:
            return {
                "risk_score": 50,
                "reason": f"Unable to load page: {response.status_code}",
                "status": "warning"
            }

        html = response.text
        soup = BeautifulSoup(html, "html.parser")

        # Heuristics to detect phishing intent
        form_count = len(soup.find_all("form"))
        password_fields = soup.find_all("input", {"type": "password"})
        external_scripts = [s for s in soup.find_all("script", src=True) if "http" in s["src"]]

        score = 0
        reasons = []

        if form_count > 2:
            score += 20
            reasons.append("Multiple forms on page")

        if len(password_fields) > 0:
            score += 40
            reasons.append("Password field detected")

        if len(external_scripts) > 3:
            score += 20
            reasons.append("Suspicious external scripts")

        if score == 0:
            reasons.append("No clear phishing indicators")

        return {
            "risk_score": min(score, 100),
            "reasons": reasons,
            "status": "success"
        }

    except requests.exceptions.RequestException as e:
        return {
            "risk_score": 60,
            "reason": f"Request failed: {str(e)}",
            "status": "error"
        }
