const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserGoalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  
  // 원본 템플릿 수정 여부 (사용자가 무게/횟수 등을 바꿨는지)
  isModified: { type: Boolean, default: false },
  
  // 진행 현황
  status: { type: String, enum: ['진행중', '부분완료', '완료', '실패'], default: '진행중' },
  startDate: { type: Date, default: Date.now },
  
  // 챌린지 추적용
  durationWeek: Number,
  currentWeek: { type: Number, default: 1 },
  completedSessions: { type: Number, default: 0 },
  activeDays: [String],

  // 사용자가 커스텀한 운동 목록 (Goal.exercises 구조와 동일)
  customExercises: [{
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    days: [String],
    restTime: Number,
    sets: [{
      setNumber: Number,
      weight: Number,
      reps: Number
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model("UserGoal", UserGoalSchema);