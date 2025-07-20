import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white font-sans text-slate-900 flex flex-col">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="text-center text-sm py-6 bg-gray-100 mt-12">
        &copy; 2025 PhishGuard AI &middot; Built with ❤️ for cybersecurity awareness.
      </footer>
    </div>
  );
};

export default Layout;
