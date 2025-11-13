// utils/routineUtils.js

/**
 * 루틴/챌린지의 진행도를 계산하여 프론트엔드 형식에 맞게 반환합니다.
 * @param {Object} routine - Routine 모델 인스턴스
 * @returns {Object} { type: String, value: Number, targetWeek?: Number }
 */
const calculateProgress = (routine) => {
    // 챌린지 (Challenge) 진행도 계산: 백분율 (%)
    if (routine.category === 'Challenge') {
        const targetWeeks = routine.targetWeeks || 1;
        
        // 총 목표 운동 횟수 계산
        // 운동 요일 리스트를 플랫하게 만들어서 총 목표 횟수를 구함.
        const totalTargetSessions = routine.exercises.reduce((acc, exercise) => {
            return acc + exercise.targetDays.length;
        }, 0) * targetWeeks;

        if (totalTargetSessions === 0) {
            return { type: 'Percent', value: 0, targetWeek: targetWeeks };
        }
        
        // (실제 완료 횟수 / 총 목표 횟수) * 100
        const progressValue = Math.min(100, (routine.completedSessions / totalTargetSessions) * 100);

        return {
            type: 'Percent',
            value: parseFloat(progressValue.toFixed(1)), // 소수점 첫째 자리까지
            targetWeek: targetWeeks
        };

    // 루틴 (Routine) 진행도 계산: 주차
    } else {
        // 루틴은 '현재 주차' 값을 그대로 사용
        const currentWeek = routine.currentWeek || 1;
        return {
            type: 'Week',
            value: currentWeek
        };
    }
};

/**
 * Mongoose 모델 객체를 목록에 필요한 간소화된 JSON 형태로 변환합니다.
 * @param {Object} routine - Mongoose Routine Document
 * @returns {Object} RoutineListItem 객체
 */
const mapRoutineToListItem = (routine) => {
    // 진행도 계산 유틸리티 사용
    const progress = calculateProgress(routine); 

    // 운동 부위 목록 추출 (중복 제거)
    const allParts = routine.parts || [];
    
    return {
        id: routine._id,
        name: routine.name,
        creator: routine.creator ? { 
            id: routine.creator._id, 
            nickname: routine.creator.nickname || 'Unknown User' 
        } : null,
        category: routine.category,
        parts: allParts,
        progress: progress,
    };
};

/**
 * Mongoose 모델 객체를 상세 조회에 필요한 JSON 형태로 변환합니다.
 * @param {Object} routine - Mongoose Routine Document
 * @returns {Object} RoutineDetail 객체
 */
const mapRoutineToDetail = (routine) => {
    const progress = calculateProgress(routine);
    
    // 루틴 전체의 운동 요일 추출 (중복 제거)
    const allDays = Array.from(new Set(
        routine.exercises.flatMap(ex => ex.targetDays)
    ));

    return {
        id: routine._id,
        name: routine.name,
        creator: routine.creator ? { 
            id: routine.creator._id, 
            nickname: routine.creator.nickname || 'Unknown User' 
        } : null,
        createdAt: routine.createdAt,
        progress: progress,
        days: allDays,
        parts: routine.parts || [],
        exercises: routine.exercises.map(ex => ({
            exerciseName: ex.exerciseName,
            targetDays: ex.targetDays,
            restTimeSeconds: ex.restTimeSeconds,
            sets: ex.sets
        }))
    };
};

module.exports = {
    calculateProgress,
    mapRoutineToListItem,
    mapRoutineToDetail,
};