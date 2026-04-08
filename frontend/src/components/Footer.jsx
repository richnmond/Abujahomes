import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AbujaHomes</h3>
            <p className="text-gray-400">Your trusted real estate platform</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/properties" className="hover:text-white">Properties</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@abujahomes.com</p>
            <p className="text-gray-400">Phone: +234 (0) 123-456-7890</p>
          </div>
        </div>
        <hr className="my-8 border-gray-700" />
        <p className="text-center text-gray-400">&copy; 2026 AbujaHomes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
