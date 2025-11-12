// models/Routine.js
const mongoose = require('mongoose');

// 1. 세트 정보 스키마 (가장 내부)
const SetSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: true,
        default: 0
    }, // 무게 (kg)
    reps: {
        type: Number,
        required: true,
        default: 0
    }, // 횟수 (회)
}, { _id: false }); // 배열 내부의 _id는 필요 없으므로 false 설정

// 2. 루틴 내 운동 정보 스키마
const RoutineExerciseSchema = new mongoose.Schema({
    // Exercise 컬렉션 참조 (운동 기본 정보)
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    },
    // 운동 이름 (조회 편의성을 위해 임베드)
    exerciseName: {
        type: String,
        required: true,
    },
    // 운동할 요일 (예: ['월', '수', '금'])
    days: {
        type: [String],
        required: true,
        default: [],
        enum: ['월', '화', '수', '목', '금', '토', '일']
    },
    // 세트 간 휴식 시간 (초 단위)
    restTime: {
        type: Number,
        default: 60,
    },
    // 세트별 상세 정보 (임베디드 배열)
    sets: {
        type: [SetSchema],
        required: true,
    },
}, { _id: false });

// 3. 메인 루틴/챌린지 스키마
const RoutineSchema = new mongoose.Schema({
    // 사용자 참조
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 루틴/챌린지 이름
    name: {
        type: String,
        required: [true, '루틴/챌린지 이름을 입력해야 합니다.'],
        trim: true,
        maxlength: [100, '이름은 100자 이내여야 합니다.']
    },
    // 타입: 'Routine' 또는 'Challenge'
    type: {
        type: String,
        enum: ['Routine', 'Challenge'],
        required: true,
        default: 'Routine'
    },
    // 챌린지일 경우 목표 주차 (루틴이면 0)
    targetWeeks: {
        type: Number,
        default: 0,
        min: 0
    },
    // 포함된 운동 목록
    exercises: {
        type: [RoutineExerciseSchema],
        default: []
    }
}, { timestamps: true });

// 성능 향상을 위해 userId와 type에 인덱스 추가 (조회 시 유용)
RoutineSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Routine', RoutineSchema);