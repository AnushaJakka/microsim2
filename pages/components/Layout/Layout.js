import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;