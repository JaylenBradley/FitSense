import React from 'react';
import PropTypes from 'prop-types';
import '../styles/custom.css';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 
        hover:from-red-400 hover:via-orange-400 hover:to-red-400 focus:outline-none 
        focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;