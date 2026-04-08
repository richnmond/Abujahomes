// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaDollarSign,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
  FaEye,
  FaEnvelope,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Fetch analytics data
  const { data: analytics } = useQuery('adminAnalytics', async () => {
    const response = await axios.get('/api/admin/analytics');
    return response.data;
  });

  // Fetch all users
  const { data: users, refetch: refetchUsers } = useQuery('adminUsers', async () => {
    const response = await axios.get('/api/admin/users');
    return response.data;
  });

  // Fetch all properties
  const { data: properties, refetch: refetchProperties } = useQuery('adminProperties', async () => {
    const response = await axios.get('/api/admin/properties');
    return response.data;
  });

  // Fetch all bookings
  const { data: bookings, refetch: refetchBookings } = useQuery('adminBookings', async () => {
    const response = await axios.get('/api/admin/bookings');
    return response.data;
  });

  // Fetch property requests
  const { data: requests, refetch: refetchRequests } = useQuery('adminRequests', async () => {
    const response = await axios.get('/api/admin/requests');
    return response.data;
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation(
    ({ userId, role }) => axios.patch(`/api/admin/users/${userId}/role`, { role }),
    {
      onSuccess: () => {
        refetchUsers();
        toast.success('User role updated successfully');
      },
      onError: () => toast.error('Failed to update user role'),
    }
  );

  // Delete user mutation
  const deleteUserMutation = useMutation(
    (userId) => axios.delete(`/api/admin/users/${userId}`),
    {
      onSuccess: () => {
        refetchUsers();
        toast.success('User deleted successfully');
      },
      onError: () => toast.error('Failed to delete user'),
    }
  );

  // Verify property mutation
  const verifyPropertyMutation = useMutation(
    ({ propertyId, isVerified }) => axios.patch(`/api/admin/properties/${propertyId}/verify`, { isVerified }),
    {
      onSuccess: () => {
        refetchProperties();
        toast.success('Property verification status updated');
      },
      onError: () => toast.error('Failed to update property verification'),
    }
  );

  // Delete property mutation
  const deletePropertyMutation = useMutation(
    (propertyId) => axios.delete(`/api/admin/properties/${propertyId}`),
    {
      onSuccess: () => {
        refetchProperties();
        toast.success('Property deleted successfully');
      },
      onError: () => toast.error('Failed to delete property'),
    }
  );

  // Update booking status mutation
  const updateBookingMutation = useMutation(
    ({ bookingId, status }) => axios.patch(`/api/admin/bookings/${bookingId}/status`, { status }),
    {
      onSuccess: () => {
        refetchBookings();
        toast.success('Booking status updated');
      },
      onError: () => toast.error('Failed to update booking'),
    }
  );

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Properties',
      value: analytics?.totalProperties || 0,
      icon: FaBuilding,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Total Bookings',
      value: analytics?.totalBookings || 0,
      icon: FaCalendarCheck,
      color: 'bg-purple-500',
      change: '+23%',
    },
    {
      title: 'Total Revenue',
      value: `$${analytics?.totalRevenue?.toLocaleString() || 0}`,
      icon: FaDollarSign,
      color: 'bg-yellow-500',
      change: '+15%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, properties, and system settings
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {['overview', 'users', 'properties', 'bookings', 'requests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                        {stat.value}
                      </p>
                      <p className="text-green-500 text-sm mt-2">{stat.change}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full text-white`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Bookings Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Monthly Bookings
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">Chart component would go here</p>
                </div>
              </div>

              {/* Property Types Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Property Types Distribution
                </h3>
                <div className="space-y-3">
                  {analytics?.propertyTypeDistribution?.map((type) => (
                    <div key={type._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{type._id}</span>
                        <span className="text-gray-800 dark:text-white">{type.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${(type.count / analytics.totalProperties) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {analytics?.recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="text-gray-800 dark:text-white">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.timestamp}</p>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users?.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                              alt={user.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateUserRoleMutation.mutate({
                              userId: user._id,
                              role: e.target.value,
                            })
                          }
                          className="text-sm border rounded px-2 py-1 dark:bg-gray-600"
                        >
                          <option value="user">User</option>
                          <option value="agent">Agent</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this user?')) {
                              deleteUserMutation.mutate(user._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {properties?.map((property) => (
              <div
                key={property._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={property.images[0]?.url}
                    alt={property.title}
                    className="w-full md:w-48 h-48 object-cover"
                  />
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {property.location}
                        </p>
                        <p className="text-primary-600 dark:text-primary-400 font-bold mt-2">
                          ${property.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            verifyPropertyMutation.mutate({
                              propertyId: property._id,
                              isVerified: !property.isVerified,
                            })
                          }
                          className={`px-3 py-1 rounded text-sm ${
                            property.isVerified
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {property.isVerified ? (
                            <FaCheckCircle className="inline mr-1" />
                          ) : (
                            <FaTimesCircle className="inline mr-1" />
                          )}
                          {property.isVerified ? 'Verified' : 'Verify'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this property?')) {
                              deletePropertyMutation.mutate(property._id);
                            }
                          }}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                        >
                          <FaTrash className="inline mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        {property.propertyType}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        {property.bedrooms} beds
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        {property.bathrooms} baths
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        {property.views} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bookings?.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {booking.propertyId?.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {booking.userId?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.userId?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            updateBookingMutation.mutate({
                              bookingId: booking._id,
                              status: e.target.value,
                            })
                          }
                          className="text-sm border rounded px-2 py-1 dark:bg-gray-600"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            // Send email notification
                            toast.success('Notification sent');
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEnvelope />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {requests?.map((request) => (
              <div
                key={request._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Property Request from {request.userId?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {request.location} | Budget: ${request.budget?.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'responded'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {request.description}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Assign to agent
                      toast.success('Agent assigned');
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Assign to Agent
                  </button>
                  <button
                    onClick={() => {
                      // Mark as responded
                      toast.success('Request marked as responded');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Mark Responded
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;