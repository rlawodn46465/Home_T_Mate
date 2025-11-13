const mongoose = require('mongoose');

// 세트 정보를 위한 스키마
const setSchema = new mongoose.Schema({
    setNumber: { type: Number, required: true }, // 세트 번호 (1, 2, ...)
    weight: { type: Number, required: true, default: 0 }, // 무게 (kg)
    reps: { type: Number, required: true, default: 0 }, // 횟수
}, { _id: false });

// 개별 운동 정보를 위한 스키마
const exerciseSchema = new mongoose.Schema({
    exerciseName: { type: String, required: true }, // 운동 이름 (예: "런지")
    targetDays: { 
        type: [String], 
        required: true,
        enum: ['일', '월', '화', '수', '목', '금', '토'] // 운동 요일
    },
    restTimeSeconds: { type: Number, required: true, default: 60 }, // 세트 간 휴식 시간 (초)
    sets: [setSchema], // 세트별 정보
}, { _id: false });

// 루틴/챌린지 메인 스키마
const RoutineSchema = new mongoose.Schema({
    // 💡 필수 메타 정보
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: [true, '루틴 이름을 입력해 주세요.'] },
    category: { 
        type: String, 
        enum: ['Routine', 'Challenge'], 
        required: true 
    },

    // 💡 챌린지 관련 정보 (Challenge일 경우만 유효)
    targetWeeks: { 
        type: Number, 
        default: 0 // 챌린지의 목표 주차
    },

    // 💡 진행 정보
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    currentWeek: { 
        type: Number, 
        default: 1 // 현재 진행 주차 (루틴의 경우 계속 증가)
    },
    completedSessions: { 
        type: Number, 
        default: 0 // 완료된 운동 세션 수 (챌린지 진행도 계산에 사용)
    },
    
    // 💡 내용
    parts: { 
        type: [String], // 메인 운동 부위 목록 (예: 하체, 어깨)
        default: [] 
    },
    exercises: [exerciseSchema], // 포함된 운동 목록

}, {
    timestamps: true // createdAt, updatedAt 자동 생성
});

module.exports = mongoose.model('Routine', RoutineSchema);