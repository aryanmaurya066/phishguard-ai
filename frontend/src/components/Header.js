import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="bg-indigo-700 text-white py-6 px-4 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <div className="text-3xl font-extrabold">PhishGuard AI</div>
          <p className="text-sm md:text-base mt-1">Smarter phishing detection. Modular. Explainable. Open.</p>
        </div>

        <nav className="space-x-4 text-sm md:text-base flex flex-wrap justify-center items-center">
          <button onClick={() => navigate('/')} className={`hover:underline ${location.pathname === '/' ? 'underline font-bold' : ''}`}>Home</button>

          {token ? (
            <>
              <button onClick={() => navigate('/analyze/email')} className={`hover:underline ${location.pathname === '/analyze/email' ? 'underline font-bold' : ''}`}>Email Detection</button>
              <button onClick={() => navigate('/analyze/web')} className={`hover:underline ${location.pathname === '/analyze/web' ? 'underline font-bold' : ''}`}>Web Detection</button>
              <button onClick={() => navigate('/education')} className={`hover:underline ${location.pathname === '/education' ? 'underline font-bold' : ''}`}>Education</button>
              {role === 'admin' && (
                <button onClick={() => navigate('/admin')} className={`hover:underline ${location.pathname === '/admin' ? 'underline font-bold' : ''}`}>Admin Panel</button>
              )}

              <div className="relative inline-block text-left">
                <button
                  className="ml-4 hover:underline text-sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Profile ▾
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                    <div className="px-4 py-2 border-b">👤 User</div>
                    {/* <button onClick={() => navigate('/profile')} className="block w-full px-4 py-2 hover:bg-gray-100 text-left">View Profile</button> */}
                    <button onClick={handleLogout} className="block w-full px-4 py-2 hover:bg-red-100 text-left text-red-600">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className={`hover:underline ${location.pathname === '/login' ? 'underline font-bold' : ''}`}>Login</button>
              <button onClick={() => navigate('/register')} className={`hover:underline ${location.pathname === '/register' ? 'underline font-bold' : ''}`}>Register</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
