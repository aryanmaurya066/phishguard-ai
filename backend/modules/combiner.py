def combine_results(text_result, sender_result, url_results, web_result):
    score = 0

    # Email-only analysis
    if text_result is not None or sender_result is not None:
        if text_result and text_result.get("prediction") == "phishing":
            score += 3

        if sender_result and sender_result.get("suspicious"):
            score += 2

        if score >= 5:
            return "phishing", score
        elif score >= 3:
            return "suspicious", score
        else:
            return "legitimate", score

    # Web-only analysis
    if url_results or web_result:
        for url in url_results or []:
            if url.get("prediction") == "phishing":
                score += 2

        if web_result and web_result.get("risk_score", 0) >= 60:
            score += 2

        if score >= 4:
            return "phishing", score
        elif score >= 2:
            return "suspicious", score
        else:
            return "legitimate", score

    # If no input at all
    return "legitimate", score
