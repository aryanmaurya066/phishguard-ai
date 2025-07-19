import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    contact_no: '',
    gmail: ''
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (photo) formData.append('photo', photo);

    try {
      const res = await axios.post("http://localhost:8000/register", formData);
      if (res.status === 200) {
        setMessage('Registered successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Register</h2>

        <input type="text" placeholder="Full Name" required
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input type="text" placeholder="Username" required
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })} />

        <input type="password" placeholder="Password" required
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <input type="text" placeholder="Contact No (optional)"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, contact_no: e.target.value })} />

        <input type="email" placeholder="Gmail (optional)"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, gmail: e.target.value })} />

        <input type="file" accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setPhoto(e.target.files[0])} />

        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Register
        </button>

        {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
