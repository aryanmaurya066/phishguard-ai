document.getElementById("checkBtn").addEventListener("click", async () => {
  const email = document.getElementById("emailText").value.trim();
  const url = document.getElementById("urlInput").value.trim();

  const payload = {
    email_text: email || null,
    urls: url ? [url] : null
  };

  try {
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    document.getElementById("result").textContent = JSON.stringify(data.result, null, 2);
  } catch (err) {
    document.getElementById("result").textContent = "Error contacting API.";
  }
});
