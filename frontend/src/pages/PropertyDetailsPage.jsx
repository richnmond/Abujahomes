import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FaBed, FaBath, FaRuler, FaPhone, FaEnvelope } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

const PropertyDetailsPage = () => {
  const { id } = useParams();

  const { data: property, isLoading, error } = useQuery(['property', id], async () => {
    const response = await axios.get(API_ENDPOINTS.PROPERTIES.DETAIL(id));
    return response.data;
  });

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error loading property</div>;
  if (!property) return <div className="container mx-auto px-4 py-8">Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Images */}
      <div className="mb-8">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
            No image available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
          <p className="text-2xl text-primary-600 font-bold mb-6">₦{property.price?.toLocaleString()}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <FaBed className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                <p className="text-lg font-bold">{property.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <FaBath className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                <p className="text-lg font-bold">{property.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <FaRuler className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Area</p>
                <p className="text-lg font-bold">{property.area} sqm</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{property.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Property Type</p>
                <p className="font-bold">{property.propertyType}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Location</p>
                <p className="font-bold">{property.location}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Views</p>
                <p className="font-bold">{property.views}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-bold">{property.isVerified ? 'Verified' : 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Agent Information</h2>
          {property.agentId && (
            <div>
              {property.agentId.avatar && (
                <img
                  src={property.agentId.avatar}
                  alt={property.agentId.name}
                  className="w-24 h-24 rounded-full mb-4"
                />
              )}
              <h3 className="text-lg font-bold mb-2">{property.agentId.name}</h3>

              {property.agentId.email && (
                <div className="flex items-center gap-2 mb-3">
                  <FaEnvelope className="text-primary-600" />
                  <a href={`mailto:${property.agentId.email}`} className="text-primary-600 hover:underline">
                    {property.agentId.email}
                  </a>
                </div>
              )}

              {property.agentId.phone && (
                <div className="flex items-center gap-2 mb-6">
                  <FaPhone className="text-primary-600" />
                  <a href={`tel:${property.agentId.phone}`} className="text-primary-600 hover:underline">
                    {property.agentId.phone}
                  </a>
                </div>
              )}

              <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition mb-2">
                Schedule Viewing
              </button>
              <button className="w-full border border-primary-600 text-primary-600 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition">
                Save Property
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
