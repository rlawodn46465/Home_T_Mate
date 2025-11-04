// models/ExerciseLog.js
const mongoose = require('mongoose');

const ExerciseLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },

  type: { type: String, enum: ['routine', 'challenge', 'single'], required: true },
  sourceName: { type: String, required: true }, // 예: “하체 루틴 A”
  date: { type: Date, default: Date.now },
  sets: [
    {
      set: Number,
      weight: Number,
      reps: Number
    }
  ],
  duration: Number, // 분 단위
}, { timestamps: true });

module.exports = mongoose.model('ExerciseLog', ExerciseLogSchema);
