import { useState } from 'react';

export default function InputForm({ onSubmit }) {
  const [urls, setUrls] = useState('');
  const [webContent, setWebContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      urls: urls ? urls.split(',').map((u) => u.trim()) : null,
      web_content: webContent || null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">URLs (comma-separated)</label>
        <input
          type="text"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="mt-1 w-full border rounded-lg p-2 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Web Content (HTML)</label>
        <textarea
          value={webContent}
          onChange={(e) => setWebContent(e.target.value)}
          className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 shadow"
      >
        Analyze
      </button>
    </form>
  );
}
