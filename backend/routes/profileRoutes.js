import express from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

const router = express.Router();

// Get profile by userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let profile;
    if (user.role === 'doctor') {
      profile = await Doctor.findOne({ userId: user._id }).populate('userId', 'email displayName');
    } else {
      profile = await Patient.findOne({ userId: user._id }).populate('userId', 'email displayName');
    }

    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Doctor profile
router.put('/doctor/:userId', async (req, res) => {
  try {
    const updatedProfile = await Doctor.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Patient profile
router.put('/patient/:userId', async (req, res) => {
  try {
    const updatedProfile = await Patient.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
