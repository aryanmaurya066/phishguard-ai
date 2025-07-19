import re
import dns.resolver
import whois
import smtplib
from datetime import datetime

free_domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']

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

def has_mx_record(domain: str) -> bool:
    try:
        dns.resolver.resolve(domain, 'MX')
        return True
    except:
        return False

def smtp_check(email: str) -> bool:
    domain = email.split('@')[1]
    try:
        records = dns.resolver.resolve(domain, 'MX')
        mx_record = str(records[0].exchange)
    except:
        return False

    try:
        server = smtplib.SMTP(timeout=10)
        server.connect(mx_record)
        server.helo("example.com")
        server.mail("test@example.com")
        code, _ = server.rcpt(email)
        server.quit()
        return code == 250
    except:
        return False

def analyze_sender_email(sender_email: str):
    match = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})$', sender_email)
    if not match:
        return {"suspicious": True, "reason": "Invalid email format", "confidence": 90.0}

    domain = match.group(1).lower()
    score = 0
    reasons = []

    # Free domain
    if domain in free_domains:
        score += 40
        reasons.append("Free email domain")

    # Long or complex domain
    if len(domain) > 20:
        score += 30
        reasons.append("Domain length > 20 characters")

    if domain.count('-') > 1:
        score += 20
        reasons.append("Multiple hyphens in domain")

    if not reasons:
        reasons.append("Common domain structure")

    # MX Record Check
    mx_valid = has_mx_record(domain)
    if not mx_valid:
        score += 30
        reasons.append("No MX record found")

    # Domain Age Check
    age_days = get_domain_age_days(domain)
    if age_days is not None and age_days < 180:
        score += 25
        reasons.append(f"Domain age is low ({age_days} days)")

    # SMTP mailbox check
    smtp_valid = smtp_check(sender_email)
    if not smtp_valid:
        score += 20
        reasons.append("SMTP mailbox not verified")

    confidence = min(score, 100)

    suspicious = confidence >= 50

    return {
        "suspicious": suspicious,
        "reason": "; ".join(reasons),
        "confidence": confidence,
        "mx_record": mx_valid,
        "smtp_verified": smtp_valid,
        "domain_age_days": age_days
    }
