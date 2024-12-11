import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserView } from './views/UserView';
import { AdminView } from './views/AdminView';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-8">
          <Routes>
            <Route path="/" element={<UserView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;