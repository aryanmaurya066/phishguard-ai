chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "phishingCheck",
    title: "🔍 Check for phishing",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "phishingCheck") {
    const selectedText = info.selectionText;

    fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email_text: selectedText || null,
        urls: selectedText?.startsWith("http") ? [selectedText] : null
      })
    })
      .then(res => res.json())
      .then(data => {
        const verdict = data?.result?.verdict || "unknown";
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Phishing Check Result",
          message: `Verdict: ${verdict.toUpperCase()}`
        });
      })
      .catch(err => {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Phishing Check Failed",
          message: "Could not connect to the API"
        });
      });
  }
});
