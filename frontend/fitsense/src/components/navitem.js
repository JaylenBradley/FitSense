import React from 'react';
import { Link } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, text, onClick, collapsed }) => {
  const sharedClasses = "flex items-center space-x-2 px-4 py-2 hover:bg-zinc-800 rounded-md transition-colors duration-200";

  if (onClick) {
    return (
      <button onClick={onClick} className={`${sharedClasses} w-full text-left`}>
        <Icon className="h-5 w-5 text-fitsense" />
        <span className={`${collapsed ? 'hidden' : 'block'} text-stone-400`}>{text}</span>
      </button>
    );
  }

  return (
    <Link to={to} className={sharedClasses}>
      <Icon className="h-5 w-5 text-fitsense" />
      <span className={`${collapsed ? 'hidden' : 'block'} text-stone-400`}>{text}</span>
    </Link>
  );
};

export default NavItem;