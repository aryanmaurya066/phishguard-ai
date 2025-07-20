import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import axios from 'axios';

export default function HistoryDashboardPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/history'); // Update if using token or different path
        setLogs(res.data.logs);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">📊 Dashboard & History</h1>
        <p className="mb-4 text-gray-600">Recent phishing analysis records:</p>

        {loading ? (
          <p>Loading history...</p>
        ) : logs.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                  <th className="px-4 py-2 text-left">Email Text</th>
                  <th className="px-4 py-2 text-left">Sender</th>
                  <th className="px-4 py-2 text-left">URL(s)</th>
                  <th className="px-4 py-2 text-left">Result</th>
                  <th className="px-4 py-2 text-left">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 text-sm text-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{log.email_text || '-'}</td>
                    <td className="px-4 py-2 text-sm">{log.sender_email || '-'}</td>
                    <td className="px-4 py-2 text-sm">{(log.urls || []).join(', ') || '-'}</td>
                    <td className="px-4 py-2 text-sm font-medium">{log.result?.verdict || 'Unknown'}</td>
                    <td className="px-4 py-2 text-sm">{log.result?.modules?.email_text?.confidence?.toFixed(2) ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
