import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPanel } from '../components/AdminPanel';
import { LoginForm } from '../components/LoginForm';
import { verifyAdmin } from '../services/database';

interface AdminSession {
  isAuthenticated: boolean;
  isSuper: boolean;
}

export const AdminView: React.FC = () => {
  const [session, setSession] = useState<AdminSession>({ isAuthenticated: false, isSuper: false });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('adminSession');
    if (auth) {
      setSession(JSON.parse(auth));
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const admin = await verifyAdmin(email, password);
      if (admin) {
        const session = { isAuthenticated: true, isSuper: admin.role === 'super' };
        localStorage.setItem('adminSession', JSON.stringify(session));
        setSession(session);
        setError('');
      } else {
        setError('Invalid email or password');
        setSession({ isAuthenticated: false, isSuper: false });
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setSession({ isAuthenticated: false, isSuper: false });
    navigate('/');
  };

  if (!session.isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      <AdminPanel isSuper={session.isSuper} />
    </div>
  );
};