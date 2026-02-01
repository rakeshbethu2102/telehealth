import express from 'express';
import Update from '../models/Update.js';

const router = express.Router();

// Get patient updates
router.get('/:patientId', async (req, res) => {
  try {
    const updates = await Update.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a new update
router.post('/', async (req, res) => {
  const { patientId, content, type } = req.body;
  try {
    const newUpdate = new Update({ patientId, content, type });
    await newUpdate.save();
    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
