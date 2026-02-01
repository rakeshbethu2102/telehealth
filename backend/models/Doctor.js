import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, default: 'General Physician' },
  qualifications: [{ type: String }],
  experience: { type: Number, default: 0 },
  bio: { type: String },
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false }
});

export default mongoose.model('Doctor', doctorSchema);
