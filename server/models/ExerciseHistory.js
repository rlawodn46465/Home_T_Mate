// models/ExerciseHistory.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExerciseHistorySchema = new Schema({
  // 1. 식별자 (누가 + 어떤 운동)
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },

  // 2. 개인화 데이터
  personalMemo: { type: String, default: "" }, // 이 운동에 대한 나만의 팁
  personalBestWeight: { type: Number, default: 0 }, // 1RM 최고 기록 캐싱
  totalExerciseCount: { type: Number, default: 0 }, // 총 수행 횟수

  // 3. 기록 배열 (Log)
  records: [{
    date: { type: Date, required: true }, // 수행 날짜
    
    // 어떤 맥락에서 했는지
    relatedUserGoalId: { type: Schema.Types.ObjectId, ref: 'UserGoal' }, 
    goalName: String, // 당시 루틴 이름 (삭제 대비 스냅샷)
    recordType: { type: String, enum: ['ROUTINE', 'CHALLENGE', 'PERSONAL'] },

    // 수행 데이터
    totalVolume: Number,
    maxWeight: Number,
    totalReps: Number,
    totalTime: Number,
    
    sets: [{
      setNumber: Number,
      weight: Number,
      reps: Number,
      isCompleted: Boolean
    }]
  }]
}, { timestamps: true });

// 한 유저는 한 운동에 대해 하나의 히스토리 문서만 가짐
ExerciseHistorySchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

module.exports = mongoose.model("ExerciseHistory", ExerciseHistorySchema);