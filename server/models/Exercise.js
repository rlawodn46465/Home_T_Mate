// models/Exercise.js
const mongoose = require('mongoose');

// 이 모델은 루틴 생성 시 사용자가 선택할 수 있는 '운동 마스터 데이터' 역할을 합니다.
const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 운동 이름 (예: 스쿼트)
  targetMuscles: [String], // 타겟 근육 (예: 대퇴사두근)
  equipment: [String], // 사용 기구 (예: 바벨, 맨몸)

  description: {
    setup: [{ step: Number, text: String }],
    movement: [{ step: Number, text: String }],
    breathing: [{ step: Number, text: String }],
    tips: [String]
  },
}, { timestamps: true });

// ExerciseMaster 대신 Exercise로 모델 이름을 유지합니다.
module.exports = mongoose.model('Exercise', ExerciseSchema);