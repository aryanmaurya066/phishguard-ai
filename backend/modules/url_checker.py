from urllib.parse import urlparse
import re
import requests
import dns.resolver
import whois
import socket
import ssl
from datetime import datetime

# Add your API keys here
VIRUSTOTAL_API_KEY = "25aa46a3b86266bbbbdce797e14107224ebed46e8fb95c539212300edeb39531"
PHISHTANK_API_KEY = "your-phishtank-api-key"  # Optional if you're scraping

def check_virustotal(url):
    try:
        headers = {"x-apikey": VIRUSTOTAL_API_KEY}
        resp = requests.post("https://www.virustotal.com/api/v3/urls", headers=headers, data={"url": url})
        if resp.status_code == 200:
            url_id = resp.json()["data"]["id"]
            result = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers)
            if result.status_code == 200:
                stats = result.json()["data"]["attributes"]["last_analysis_stats"]
                malicious = stats.get("malicious", 0)
                return "malicious" if malicious > 0 else "clean"
    except:
        return "error"
    return "unknown"

def check_phishtank(url):
    try:
        response = requests.post(
            "https://checkurl.phishtank.com/checkurl/",
            data={
                "url": url,
                "format": "json",
                "app_key": PHISHTANK_API_KEY
            },
            headers={
                "User-Agent": "Mozilla/5.0"
            }
        )
        if response.status_code == 200:
            json_resp = response.json()
            is_phish = json_resp["results"]["valid"] and json_resp["results"]["in_database"]
            return "malicious" if is_phish else "clean"
    except:
        return "error"
    return "unknown"

def has_mx_record(domain: str) -> bool:
    try:
        dns.resolver.resolve(domain, 'MX')
        return True
    except:
        return False

def get_domain_age_days(domain: str):
    try:
        w = whois.whois(domain)
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        age = (datetime.now() - creation_date).days
        return age
    except:
        return None

def get_ssl_info(domain: str):
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                start_date = datetime.strptime(cert['notBefore'], "%b %d %H:%M:%S %Y %Z")
                end_date = datetime.strptime(cert['notAfter'], "%b %d %H:%M:%S %Y %Z")
                age_days = (datetime.utcnow() - start_date).days
                return {
                    "valid": True,
                    "start_date": str(start_date),
                    "end_date": str(end_date),
                    "age_days": age_days
                }
    except:
        return {"valid": False}

def analyze_urls(url: str):
    parsed = urlparse(url)
    domain = parsed.netloc.replace("www.", "")

    ssl_info = get_ssl_info(domain)

    features = {
        "url": url,
        "url_length": len(url),
        "has_ip": bool(re.match(r"\d{1,3}(\.\d{1,3}){3}", parsed.netloc)),
        "contains_https": 'https' in url.lower(),
        "contains_login": 'login' in url.lower(),
        "special_char_count": sum(c in url for c in ['@', '?', '-', '_', '=', '&']),
        "mx_record": has_mx_record(domain),
        "domain_age_days": get_domain_age_days(domain),
        "ssl_valid": ssl_info["valid"],
        "ssl_age_days": ssl_info.get("age_days")
    }

    # Local prediction logic
    local_score = 0
    reasons = []

    if features["has_ip"]:
        local_score += 2
        reasons.append("Uses IP address instead of domain")
    if not features["contains_https"]:
        local_score += 1
        reasons.append("Does not use HTTPS")
    if features["contains_login"]:
        local_score += 2
        reasons.append("Contains keyword 'login'")
    if features["url_length"] > 75:
        local_score += 1
        reasons.append("URL length > 75")
    if features["special_char_count"] > 5:
        local_score += 1
        reasons.append("Contains many special characters")
    if not features["mx_record"]:
        local_score += 2
        reasons.append("Domain has no MX record")
    if features["domain_age_days"] is not None and features["domain_age_days"] < 180:
        local_score += 2
        reasons.append("Domain is younger than 180 days")
    if not features["ssl_valid"]:
        local_score += 3
        reasons.append("Invalid or missing SSL certificate")
    elif features["ssl_age_days"] is not None and features["ssl_age_days"] < 30:
        local_score += 2
        reasons.append("SSL certificate is recently issued (<30 days)")

    local_prediction = "phishing" if local_score >= 6 else "suspicious" if local_score >= 3 else "legitimate"

    # API-based checks
    vt_status = check_virustotal(url)
    phishtank_status = check_phishtank(url)

    # final_prediction = "phishing" if "malicious" in [vt_status, phishtank_status] or local_prediction == "phishing" else "legitimate"
    final_prediction = "phishing" if "malicious" in [vt_status, phishtank_status] or local_prediction == "phishing" or local_prediction == "suspicious" else "legitimate"

    return {
        "url": url,
        "features": features,
        "local_prediction": local_prediction,
        "reasons": reasons,
        "virustotal_status": vt_status,
        "phishtank_status": phishtank_status,
        "prediction": final_prediction
    }
