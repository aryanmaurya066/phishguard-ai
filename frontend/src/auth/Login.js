import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../api/authApi';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form); // this now returns access_token
      const token = res.data.access_token;
      
      if (!token) {
        setMessage("Login failed: no token received");
        return;
      }
      
      localStorage.setItem('token', token); // ✅ store actual JWT
      localStorage.setItem("username", res.data.user.username);
      navigate('/analyze/email');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Login</h2>
        <input type="text" placeholder="Username" value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} required className="w-full p-2 border rounded mb-3" />
        <input type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full p-2 border rounded mb-4" />
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Login</button>
        {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
