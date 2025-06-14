import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
  user: {
    id: string;
    email: string;
    created_at: string;
  };
}

const Layout: React.FC<LayoutProps> = ({ user }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
