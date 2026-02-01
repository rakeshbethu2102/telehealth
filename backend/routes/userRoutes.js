import express from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

const router = express.Router();

// Create or get user after Firebase login
router.post('/sync', async (req, res) => {
  const { uid, email, displayName, role } = req.body;
  try {
    let user;
    if (uid) {
      user = await User.findOne({ uid });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      if (!role) return res.status(400).json({ error: "Role is required for new users" });
      user = new User({ uid: uid || `mock-${Date.now()}`, email, displayName, role });
      await user.save();

      // Initialize role-specific profile
      if (role === 'doctor') {
        const doctorProfile = new Doctor({ userId: user._id });
        await doctorProfile.save();
      } else if (role === 'patient') {
        const patientProfile = new Patient({ userId: user._id });
        await patientProfile.save();
      }
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
