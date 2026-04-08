// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    ...(user ? [
      { path: '/dashboard', label: 'Dashboard' },
      ...(user.role === 'agent' || user.role === 'admin' ? [{ path: '/add-property', label: 'Add Property' }] : []),
    ] : []),
        ...((user?.role === 'admin') ? [
    { path: '/admin', label: 'Admin Panel' }
    ] : [])
  ];
  

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            RealEstate
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <FiSun className="text-yellow-500" /> : <FiMoon />}
            </button>

            {user ? (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t dark:border-gray-700"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full mt-2 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;