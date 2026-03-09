import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Welcome to SLA Sentinel</h1>
        <p className="text-lg text-blue-700 max-w-xl mx-auto">
          Proactively prevent SLA breaches and manage your support tickets efficiently. Secure, fast, and easy to use.
        </p>
      </header>
      <button
        className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-semibold text-lg transition"
        onClick={handleLoginClick}
      >
        Login
      </button>
    </div>
  );
};

export default LandingPage;
