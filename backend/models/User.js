import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
