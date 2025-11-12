const ExerciseLog = require('../models/ExerciseLog');
const Exercise = require('../models/Exercise');
const UserStats = require('../models/UserStats');
const { NotFoundError } = require('../utils/errorHandler');

/**
 * @description 운동 목록을 필터링/검색하여 조회합니다. (2번째 이미지 구현)
 * @param {object} filterOptions - 검색 및 필터링을 위한 객체 (예: { name: '스쿼트', category: '하체' })
 * @returns {Promise<Array>} 운동 이름, 카테고리, 타겟 근육, 장비만 포함된 운동 목록
 */
const getExerciseList = async (filterOptions = {}) => {
    // 1. 쿼리 객체 생성
    const query = {};
    if (filterOptions.search) {
        // 운동 이름, 카테고리 등에서 검색어 일치 확인 (대소문자 구분 없이)
        const regex = new RegExp(filterOptions.search, 'i');
        query.$or = [
            { name: { $regex: regex } },
            { category: { $regex: regex } },
            { targetMuscles: { $regex: regex } },
            { equipment: { $regex: regex } },
        ];
    }
    
    if (filterOptions.category) {
        query.category = filterOptions.category;
    }
    // 필요한 다른 필터 옵션도 여기에 추가할 수 있습니다. (예: targetMuscles)

    // 2. 필요한 필드만 선택하여 조회 (name, category, targetMuscles, equipment)
    const exercises = await Exercise.find(query)
        .select('name category targetMuscles equipment') // 필요한 4가지 필드만 선택
        .lean(); // Mongoose Document가 아닌 Plain JavaScript Object로 반환하여 성능 최적화
    
    return exercises;
};


/**
 * @description 운동 로그를 DB에 추가하는 서비스 로직 (기존 함수)
 */
const addExerciseLog = async (userId, exerciseId, logData) => {
  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) throw new NotFoundError("운동을 찾을 수 없습니다.");

  const log = new ExerciseLog({
    userId,
    exerciseId,
    type: logData.type,
    sourceName: logData.sourceName,
    sets: logData.sets,
    duration: logData.duration,
  });

  return await log.save();
};

/**
 * @description 특정 운동의 상세 정보, 사용자 통계, 최근 로그를 조회합니다.
 * @param {string} exerciseId - 조회할 운동 ID
 * @param {string} userId - 현재 로그인된 사용자 ID
 * @returns {Promise<object>} 운동 상세 정보, 통계, 최근 로그를 포함하는 객체
 */
const getExerciseDetail = async (exerciseId, userId) => {
  // 1. 운동 기본 정보 조회
  const exercise = await Exercise.findById(exerciseId).select("-__v -createdAt -updatedAt");
  if (!exercise) {
    throw new NotFoundError("요청하신 운동 정보를 찾을 수 없습니다.");
  }

  // 2. 사용자 통계(UserStats) 조회
  // 'exerciseId'와 'userId' 모두 일치하는 단일 문서 조회
  const myStats = await UserStats.findOne({ exerciseId, userId }).select("-__v -createdAt -updatedAt");

  // 3. 최근 운동 로그(ExerciseLog) 조회
  // 최근 3개의 로그를 최신순으로 조회 (sort: -1)
  const recentLogs = await ExerciseLog.find({ exerciseId, userId })
    .sort({ date: -1 }) // 최신순 정렬
    .limit(3)
    .select("-__v -updatedAt -userId -exerciseId"); // 불필요한 필드 제외

  // DB에 통계가 없으면 기본값으로 초기화
  const userStatsData = myStats || {
    best: { weight: 0, volume: 0, reps: 0, time: 0 },
    total: { weight: 0, reps: 0, volume: 0, time: 0 },
    memo: "첫 운동 기록을 남겨보세요!",
  };

  return {
    exercise: exercise.toObject({ versionKey: false }),
    myStats: userStatsData.toObject ? userStatsData.toObject() : userStatsData, // Mongoose 문서일 경우 toObject 호출
    recentLogs,
  };
};

module.exports = {
  getExerciseList,
  addExerciseLog,
  getExerciseDetail,
};
