import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative">
        {/* Background Elements (similar to Hero) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-green-200 dark:bg-green-800 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
