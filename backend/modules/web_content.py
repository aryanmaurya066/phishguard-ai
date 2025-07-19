from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse


def analyze_web_content(html: str):
    soup = BeautifulSoup(html, 'html.parser')

    # 1. Phishing keyword detection
    suspicious_keywords = [
        "login", "verify", "account suspended", "password",
        "reset password", "confirm your identity", "unusual activity",
        "your account has been limited", "secure your account",
        "click here to verify", "update your billing info"
    ]
    keyword_hits = [kw for kw in suspicious_keywords if kw in html.lower()]

    # 2. Form analysis
    forms = soup.find_all('form')
    form_suspicion = 0
    for form in forms:
        inputs = form.find_all('input')
        for inp in inputs:
            if inp.get('type') in ['password', 'email', 'text']:
                form_suspicion += 1

    # 3. Suspicious domains in links
    links = soup.find_all('a', href=True)
    known_brands = ["paypal", "google", "microsoft", "apple", "facebook"]
    brand_mismatches = []
    for link in links:
        href = link['href']
        for brand in known_brands:
            if brand in link.text.lower() and brand not in urlparse(href).netloc.lower():
                brand_mismatches.append(href)

    # 4. Obfuscated JavaScript or suspicious scripts
    scripts = soup.find_all('script')
    script_flags = 0
    for script in scripts:
        if script.string and any(keyword in script.string.lower() for keyword in ["eval", "atob", "obfuscate", "decrypt"]):
            script_flags += 1

    # 5. Total risk score
    score = (len(keyword_hits) * 10) + (form_suspicion * 5) + (len(brand_mismatches) * 10) + (script_flags * 10)
    score = min(score, 100)  # Cap score at 100

    return {
        "risk_score": score,
        "phishing_keywords_found": keyword_hits,
        "form_input_suspicion": form_suspicion,
        "brand_mismatched_links": brand_mismatches,
        "suspicious_script_count": script_flags,
        "login_form_detected": any('<form' in html.lower() for form in forms)
    }
