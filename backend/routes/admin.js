// backend/routes/admin.js
import express from 'express';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import RequestProperty from '../models/RequestProperty.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(auth, adminAuth);

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue from premium listings
    const premiumProperties = await Property.find({ isPremium: true });
    const totalRevenue = premiumProperties.length * 100; // Assuming $100 per premium listing
    
    // Property type distribution
    const propertyTypeDistribution = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);
    
    // Recent activity (last 10 bookings and property additions)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name');
    
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('agentId', 'name');
    
    const recentActivity = [
      ...recentBookings.map(b => ({
        description: `New booking from ${b.userId?.name}`,
        timestamp: b.createdAt,
        type: 'booking'
      })),
      ...recentProperties.map(p => ({
        description: `New property listed: ${p.title} by ${p.agentId?.name}`,
        timestamp: p.createdAt,
        type: 'property'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue,
      propertyTypeDistribution,
      recentActivity: recentActivity.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete user's properties and bookings
    await Property.deleteMany({ agentId: req.params.userId });
    await Booking.deleteMany({ userId: req.params.userId });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all properties
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify property
router.patch('/properties/:propertyId/verify', async (req, res) => {
  try {
    const { isVerified } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.propertyId,
      { isVerified },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete property (admin)
router.delete('/properties/:propertyId', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Also delete related bookings
    await Booking.deleteMany({ propertyId: req.params.propertyId });
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('propertyId', 'title price location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/bookings/:bookingId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all property requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await RequestProperty.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign request to agent
router.patch('/requests/:requestId/assign', async (req, res) => {
  try {
    const { agentId, message } = req.body;
    const request = await RequestProperty.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.responses.push({
      agentId,
      message,
      createdAt: new Date()
    });
    request.status = 'responded';
    
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get platform statistics
router.get('/statistics', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const stats = {
      newUsers: await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      newProperties: await Property.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      activeBookings: await Booking.countDocuments({ status: 'confirmed' }),
      pendingVerifications: await Property.countDocuments({ isVerified: false }),
      topAgents: await Property.aggregate([
        { $group: { _id: '$agentId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } }
      ]),
      popularLocations: await Property.aggregate([
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;