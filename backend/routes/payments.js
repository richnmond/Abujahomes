import express from 'express';

const router = express.Router();

// Payment routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all payments' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Get payment by ID' });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Process payment' });
});

router.get('/verify/:id', (req, res) => {
  res.status(200).json({ message: 'Verify payment' });
});

export default router;
