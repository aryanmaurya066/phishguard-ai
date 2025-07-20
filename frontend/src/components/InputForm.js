import { useState } from 'react';

export default function InputForm({ onSubmit }) {
  const [emailText, setEmailText] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email_text: emailText || null,
      sender_email: senderEmail || null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label className="block text-sm font-medium text-gray-700">Sender Email</label>
        <input
          type="text"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          className="mt-1 w-full border rounded-lg p-2 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email Text</label>
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          rows={4}
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
