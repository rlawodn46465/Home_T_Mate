// models/Goal.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// 목표 내 운동 구성
const GoalExerciseSchema = new Schema({
  exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  name: String, 
  targetMuscles: [String],
  days: [String], 
  restTime: Number,
  sets: [{
    setNumber: Number,
    weight: Number,
    reps: Number
  }]
}, { _id: false });

const GoalSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  goalType: { type: String, enum: ['ROUTINE', 'CHALLENGE'], required: true },
  
  durationWeek: { type: Number }, 
  parts: [String], 
  
  // 공개 설정
  isUserPublic: { type: Boolean, default: false },
  isBoardPublic: { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 },

  exercises: [GoalExerciseSchema]
}, { timestamps: true });

module.exports = mongoose.model("Goal", GoalSchema);