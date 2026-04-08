// src/components/PropertyCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Link to={`/property/${property._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]?.url || 'https://via.placeholder.com/400x300'}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          {property.isVerified && (
            <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
              Verified
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <FaMapMarkerAlt className="mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <FaBed className="mr-1" /> {property.bedrooms}
              </span>
              <span className="flex items-center">
                <FaBath className="mr-1" /> {property.bathrooms}
              </span>
            </div>
            <span className="text-primary-600 dark:text-primary-400 font-bold">
              ₦{property.price.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {property.propertyType}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;