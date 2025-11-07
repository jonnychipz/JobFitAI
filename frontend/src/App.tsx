import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { UploadPage } from '@/pages/UploadPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<div>Dashboard (Coming Soon)</div>} />
        <Route path="/jobs" element={<div>Job Match (Coming Soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
};
