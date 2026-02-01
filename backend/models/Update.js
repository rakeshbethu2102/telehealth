import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['health_status', 'symptom', 'medication'], default: 'health_status' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Update', updateSchema);
