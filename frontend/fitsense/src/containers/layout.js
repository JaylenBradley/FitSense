import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { 
  FiHome, 
  FiUser,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import { IoFastFood } from "react-icons/io5";
import { BiFoodMenu } from "react-icons/bi";
import { GiWeightLiftingUp } from "react-icons/gi";
import { FaDumbbell } from "react-icons/fa";
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
              <FiChevronsRight className="h-5 w-5 text-stone-400" /> : 
              <FiChevronsLeft className="h-5 w-5 text-stone-400"/>}
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            <li>
              <NavItem to="/" icon={FiHome} text="Home" collapsed={collapsed} />
            </li>
            <li>
              <NavItem to="/workouts" icon={GiWeightLiftingUp} text="Workouts" collapsed={collapsed} />
            </li>
            <li>
              <NavItem to="/create-workout" icon={FaDumbbell} text="Create Workout" collapsed={collapsed} />
            </li>
            <li>
              <NavItem to="/meal-plans" icon={BiFoodMenu} text="Meal Plans" collapsed={collapsed} />
            </li>
            <li>
              <NavItem to="/create-meal-plan" icon={IoFastFood} text="Create Meal Plan" collapsed={collapsed} />
            </li>
          </ul>
          
          {/* Separator */}
          <div className="my-4 border-t border-zinc-800"></div>
          
          {/* Auth items at bottom */}
          <ul className="space-y-2">
            {!user ? (
              <li>
                <NavItem to="/signin" icon={FiUser} text="Login" collapsed={collapsed} />
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                >
                  <FiUser className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Logout</span>}
                </button>
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