// services/routineService.js
const Routine = require('../models/Routine');
const Exercise = require('../models/Exercise');
const { BadRequestError, NotFoundError } = require('../utils/errorHandler');

/**
 * @description 새로운 루틴 또는 챌린지 데이터를 DB에 저장합니다.
 * @param {string} userId - 현재 로그인된 사용자 ID
 * @param {object} routineData - 클라이언트로부터 받은 루틴 데이터
 * @returns {Promise<object>} 저장된 루틴 문서
 */
const createRoutine = async (userId, routineData) => {
    const { name, type, targetWeeks, exercises } = routineData;

    // 1. 기본 유효성 검사
    if (!name || !type || !exercises || exercises.length === 0) {
        throw new BadRequestError("루틴 이름, 타입, 최소 1개 이상의 운동은 필수입니다.");
    }
    
    if (type === 'Challenge' && (!targetWeeks || targetWeeks < 1)) {
        throw new BadRequestError("챌린지 타입은 유효한 목표 주차(targetWeeks)가 필요합니다.");
    }
    
    // 2. 운동 유효성 검사 및 이름 매핑 (DB 일관성 및 조회 성능 확보)
    const validExercises = [];
    
    for (const item of exercises) {
        // 필수 필드 확인
        if (!item.exerciseId || !item.days || item.days.length === 0 || !item.sets || item.sets.length === 0) {
            throw new BadRequestError(`운동 항목의 필수 필드(ID, 요일, 세트)가 누락되었습니다.`);
        }

        // ExerciseId의 유효성 검사 및 이름 조회
        const exerciseDoc = await Exercise.findById(item.exerciseId).select('name');
        if (!exerciseDoc) {
            throw new NotFoundError(`ID ${item.exerciseId}에 해당하는 운동을 찾을 수 없습니다.`);
        }

        // 루틴에 필요한 데이터 구조로 변환
        validExercises.push({
            exerciseId: item.exerciseId,
            exerciseName: exerciseDoc.name, // Exercise 문서에서 이름 가져와서 저장
            days: item.days,
            restTime: item.restTime || 60,
            sets: item.sets.map(set => ({
                weight: set.weight || 0,
                reps: set.reps || 0
            }))
        });
    }

    // 3. Routine 문서 생성 및 저장
    const newRoutine = new Routine({
        userId,
        name,
        type,
        targetWeeks: type === 'Challenge' ? targetWeeks : 0,
        exercises: validExercises
    });

    const savedRoutine = await newRoutine.save();
    return savedRoutine.toObject({ versionKey: false });
};

module.exports = {
    createRoutine,
};