// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { FaSearch, FaBuilding, FaHome, FaCity, FaStar } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
  });

  const { data: featuredProperties } = useQuery('featuredProperties', async () => {
    const response = await axios.get(`${API_ENDPOINTS.PROPERTIES.LIST}?limit=6&sort=newest`);
    return response.data.properties;
  });

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Home Buyer',
      content: 'Amazing experience! Found my dream home within days.',
      rating: 5,
    },
    {
      name: 'Jane Smith',
      role: 'Property Seller',
      content: 'The best platform to list properties. Got multiple offers quickly!',
      rating: 5,
    },
    {
      name: 'Mike Johnson',
      role: 'Real Estate Agent',
      content: 'Professional platform with excellent features for agents.',
      rating: 5,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
    if (searchParams.propertyType) params.append('propertyType', searchParams.propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Find Your Dream Property
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            Discover the best properties in your desired location
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="px-4 py-2 border rounded-lg text-gray-800"
                />
                <select
                  value={searchParams.propertyType}
                  onChange={(e) => setSearchParams({ ...searchParams, propertyType: e.target.value })}
                  className="px-4 py-2 border rounded-lg text-gray-800"
                >
                  <option value="">Property Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Land">Land</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Short-let">Short-let</option>
                </select>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={searchParams.minPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                  className="px-4 py-2 border rounded-lg text-gray-800"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                  className="px-4 py-2 border rounded-lg text-gray-800"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center"
              >
                <FaSearch className="mr-2" /> Search Properties
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
          >
            Featured Properties
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties?.map((property, index) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div>Properties Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div>Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div>Expert Agents</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div>Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
          >
            What Our Clients Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{testimonial.content}</p>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to List Your Property?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied property owners and agents</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            List Your Property
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;