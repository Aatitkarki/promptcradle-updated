import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import { useThemeStore } from '../../store/themeStore';

const Layout: React.FC = () => {
  const { mode } = useThemeStore();

  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: mode === 'dark' ? '#374151' : '#ffffff',
              color: mode === 'dark' ? '#f3f4f6' : '#1f2937',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
