import React from 'react';

const Footer = () => {
  return(
  <footer className="bg-white shadow-md mt-10">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">© 2025 MicroSim Learning</p>
        <div className="flex space-x-4">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
        </div>
      </div>
    </div>
  </footer>
)};

export default Footer;