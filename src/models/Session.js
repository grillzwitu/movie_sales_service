import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
user_id: {
    type: String,
    required: true,
  },
  jwt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);
