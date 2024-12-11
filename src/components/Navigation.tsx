import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';
import defaultLogo from '../assets/logo.svg';
import { getLogo } from '../services/database';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [logo, setLogo] = useState<string>(defaultLogo);
  
  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const customLogo = await getLogo();
      if (customLogo) {
        setLogo(customLogo);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src={logo} alt="OC Global" className="h-10 w-auto" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              OC Global Consultancy
            </span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Application Form
            </Link>
            <Link
              to="/admin"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/admin'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={18} className="mr-1" />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};