import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, description, icon: Icon, linkTo, linkText }) => {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-8 shadow-lg shadow-zinc-900/50 transition-all duration-300 hover:shadow-xl">
      <div className="text-center mb-6">
        {Icon}
      </div>
      <h2 className="text-xl font-bold text-gray-300 text-center mb-4">{title}</h2>
      <p className="text-gray-400 text-center mb-6">
        {description}
      </p>
      <Link 
        to={linkTo}
        className="block w-full text-center px-4 py-2 rounded-md text-white bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 hover:from-red-400 hover:via-orange-400 hover:to-red-400 transition-all duration-300"
      >
        {linkText}
      </Link>
    </div>
  );
};

export default Card;