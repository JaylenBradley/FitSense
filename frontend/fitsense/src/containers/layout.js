import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { HomeIcon, UserIcon, PlusIcon, ViewListIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/outline';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../components/AuthContext';
import '../styles/custom.css'; 
import NavItem from '../components/navitem';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    const windowConfirm = window.confirm('Are you sure you want to log out?');
    
    if (!windowConfirm) {
      return;
    }

    try {
      await signOut(auth);
      alert('Logged out successfully!');
      navigate('/signin');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-800">
      <aside className={`bg-zinc-900 text-white ${collapsed ? 'w-20' : 'w-64'} flex flex-col transition-all duration-300 shadow-lg`}>
        <div className="flex items-center justify-between px-4 py-6 border-b border-zinc-800">
          <span className={`text-2xl font-extrabold ${collapsed ? 'hidden' : 'block'} text-fitsense`}>FitSense</span>
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="text-gray-500 hover:text-fitsense transition-colors duration-200 focus:outline-none"
          >
            {collapsed ? 
              <ChevronDoubleRightIcon className="h-5 w-5 text-stone-400" /> : 
              <ChevronDoubleLeftIcon className="h-5 w-5 text-stone-400"/>}
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            <li>
              <NavItem to="/" icon={HomeIcon} text="Home" collapsed={collapsed} />
            </li>
            <li>
              <NavItem to="/workouts" icon={ViewListIcon} text="Workouts" collapsed={collapsed} />
            </li>
            <li>
              <NavItem to="/create" icon={PlusIcon} text="Create Workout" collapsed={collapsed} />
            </li>
          </ul>
          
          {/* Separator */}
          <div className="my-4 border-t border-zinc-800"></div>
          
          {/* Auth items at bottom */}
          <ul className="space-y-2">
            {!user ? (
              <li>
                <NavItem to="/signin" icon={UserIcon} text="Login" collapsed={collapsed} />
              </li>
            ) : (
              <li>
                <NavItem icon={UserIcon} text="Logout" onClick={handleLogout} collapsed={collapsed} />
              </li>
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;