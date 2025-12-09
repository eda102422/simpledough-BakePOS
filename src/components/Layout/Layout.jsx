import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;