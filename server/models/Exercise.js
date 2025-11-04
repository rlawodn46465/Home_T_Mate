// models/Exercise.js
const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 스쿼트
  category: { type: String, required: true }, // 하체
  targetMuscles: [String], // ['대퇴사두']
  equipment: [String], // ['바벨']

  description: {
    setup: [{ step: Number, text: String }],
    movement: [{ step: Number, text: String }],
    breathing: [{ step: Number, text: String }],
    tips: [String]
  },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);
