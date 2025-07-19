export default function ResultsCard({ result }) {
  const header = result?.header;
  const body = result?.result;

  if (!body) return null;

  const { classification, is_phishing, score, email_text, sender_email, urls, web_content } = body;

  const getVerdictStyle = (status) => {
    if (status === 'phishing' || is_phishing === true) return 'bg-red-100 text-red-700';
    if (status === 'suspicious') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className={`p-4 rounded-lg font-semibold mb-4 ${getVerdictStyle(classification)}`}>
        <h2 className="text-xl">
          This looks like a <span className="uppercase">{classification}</span> message.
        </h2>
        <p className="text-sm mt-1">
          Final Score: <strong>{score}</strong> | Phishing Detected: <strong>{is_phishing ? 'Yes' : 'No'}</strong>
        </p>
      </div>

      {header && (
        <p className="text-xs text-gray-400 mb-4">
          Request ID: {header.request_id} | Time: {new Date(header.timestamp).toLocaleString()}
        </p>
      )}

      <div className="space-y-4">
        {email_text && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <strong>Email Text Analysis:</strong>
            <p className="text-sm text-gray-700 mt-1">Prediction: {email_text.prediction}</p>
            <p className="text-sm text-gray-700">Confidence: {email_text.confidence}%</p>
          </div>
        )}

        {sender_email && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <strong>Sender Email Analysis:</strong>
            <p className="text-sm text-gray-700 mt-1">Suspicious: {sender_email.suspicious ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-700">Reason: {sender_email.reason}</p>
            <p className="text-sm text-gray-700">Confidence: {sender_email.confidence}%</p>
          </div>
        )}

        {urls && urls.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <strong>URL Analysis:</strong>
            {urls.map((url, index) => (
              <div key={index} className="mt-2 text-sm text-gray-700">
                <p>URL: {url.url}</p>
                <p>Prediction: {url.prediction}</p>
                <p>Virustotal: {url.virustotal_status}, Phishtank: {url.phishtank_status}</p>
              </div>
            ))}
          </div>
        )}

        {web_content && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <strong>Website Content Analysis:</strong>
            <p className="text-sm text-gray-700 mt-1">Risk Score: {web_content.risk_score}</p>
            <p className="text-sm text-gray-700">Summary: {web_content.summary || 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
