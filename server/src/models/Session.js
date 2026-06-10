import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String },
  answer: { type: mongoose.Schema.Types.Mixed },
  filesUsed: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

sessionSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export const Session = mongoose.model('Session', sessionSchema);
