// models/Exercise.js
const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // 운동명 (예: 스쿼트)
    category: { type: [String], required: true }, // 가슴, 등, 하체, 어깨, 팔, 코어
    targetMuscles: [String], // 타겟 근육 (예: 대퇴사두근)
    equipment: [String], // 사용 기구 (예: 바벨, 맨몸)

    description: {
      setup: [{ step: Number, text: String }],
      movement: [{ step: Number, text: String }],
      breathing: [{ step: Number, text: String }],
      tips: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", ExerciseSchema);
