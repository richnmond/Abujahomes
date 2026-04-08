import express from 'express';

const router = express.Router();

// Booking routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all bookings' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Get booking by ID' });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create booking' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: 'Update booking' });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Cancel booking' });
});

export default router;
