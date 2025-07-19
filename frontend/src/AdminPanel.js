import axios from 'axios';
import { useState } from 'react';

export default function AdminPanel() {
  const [status, setStatus] = useState(null);
  const [output, setOutput] = useState('');

  const handleRetrain = async () => {
    setStatus("Running...");
    try {
      const res = await axios.post('http://localhost:8000/admin/retrain');
      setStatus("✅ Success");
      setOutput(res.data.output);
    } catch (err) {
      setStatus("❌ Failed");
      setOutput(err.response?.data?.detail || "Error occurred");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🛠 Admin Panel</h1>
      <button
        onClick={handleRetrain}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        🔁 Retrain Model
      </button>

      {status && <p className="mt-4 font-semibold">{status}</p>}
      {output && <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">{output}</pre>}
    </div>
  );
}
