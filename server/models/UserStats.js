// models/UserStats.js
const mongoose = require('mongoose');

const UserStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },

  best: {
    weight: Number,
    volume: Number,
    reps: Number,
    time: Number,
  },
  total: {
    weight: Number,
    reps: Number,
    volume: Number,
    time: Number,
  },
  memo: String
}, { timestamps: true });

module.exports = mongoose.model('UserStats', UserStatsSchema);
