import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  medicalHistory: [{ type: String }],
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String }
  }
});

export default mongoose.model('Patient', patientSchema);
