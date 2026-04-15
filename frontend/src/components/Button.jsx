import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  loading = false,
  loadingMessage = 'Processing...',
  className = '',
  variant = 'primary' 
}) => {
  const baseClasses = 'w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 shrink-0 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{loadingMessage}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
