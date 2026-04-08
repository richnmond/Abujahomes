import express from 'express';
import Property from '../models/Property.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    req.user = user;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Get all properties with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      propertyType,
      limit = 10,
      sort = 'newest',
      page = 1,
    } = req.query;

    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (minArea) filter.area = { ...filter.area, $gte: Number(minArea) };
    if (maxArea) filter.area = { ...filter.area, $lte: Number(maxArea) };
    if (propertyType) filter.propertyType = propertyType;

    let sortBy = {};
    if (sort === 'newest') sortBy = { createdAt: -1 };
    if (sort === 'price-low') sortBy = { price: 1 };
    if (sort === 'price-high') sortBy = { price: -1 };
    if (sort === 'popular') sortBy = { views: -1 };

    const skip = (page - 1) * limit;

    const properties = await Property.find(filter)
      .sort(sortBy)
      .limit(Number(limit))
      .skip(skip)
      .populate('agentId', 'name avatar email phone');

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('agentId', 'name avatar email phone');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create property
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      price,
      location,
      coordinates,
      images,
      propertyType,
      bedrooms,
      bathrooms,
      area,
    } = req.body;

    const property = new Property({
      title,
      description,
      price,
      location,
      coordinates,
      images: images || [],
      propertyType,
      bedrooms,
      bathrooms,
      area,
      agentId: req.user._id,
    });

    await property.save();
    await property.populate('agentId', 'name avatar email phone');

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update property
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.agentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('agentId', 'name avatar email phone');

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete property
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.agentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
