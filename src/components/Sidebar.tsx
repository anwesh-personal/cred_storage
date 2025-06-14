import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, PlusCircle, User as UserIcon, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface SidebarProps {
  user: User;
}

const Sidebar = ({ user }: SidebarProps) => {
  const location = useLocation();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/products', label: 'My Products', icon: <ShoppingBag size={20} /> },
    { path: '/add-product', label: 'Add Product', icon: <PlusCircle size={20} /> },
    { path: '/profile', label: 'Profile', icon: <UserIcon size={20} /> },
  ];
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600">Marketing Assistant</h1>
      </div>
      
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
              {user.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
        >
          <LogOut size={18} className="mr-2" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
