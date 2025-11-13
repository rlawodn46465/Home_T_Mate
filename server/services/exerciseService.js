const Exercise = require("../models/Exercise");
// ExerciseLog, UserStats 등의 모델이 필요할 수 있으나, 현재는 Exercise만 사용합니다.
const { NotFoundError } = require("../utils/errorHandler");

// 필터 옵션에 따라 운동 마스터 목록 조회
const getExerciseList = async (filterOptions = {}) => {
  const { search, part, tool } = filterOptions;
  const query = {};

  // 검색어 필터링 (search)
  if (search) {
    query.name = { $regex: search, $options: "i" }; // 대소문자 구분 없이 검색
  }

  // 운동 부위 필터링 (part)
  if(part){
    query.targetMuscles = part;
  }

  // 운동 기구 필터링 (tool)
  if(tool){
    query.equipment = tool;
  }

  // 이름 오름차순으로 정렬하여 반환
  const exercises = await Exercise.find(query).sort({ name: 1 });

  return exercises;
};

/**
 * @description 특정 운동의 상세 정보 (현재는 마스터 데이터만 반환)를 가져옵니다.
 * 사용자 통계/로그 기능은 ExerciseLog 모델 구현 후 추가될 예정입니다.
 */
// 특정 운동의 상세 정보 가져오기
const getExerciseDetail = async (exerciseId, userId) => {
  // 1. 운동 마스터 데이터 조회
  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new NotFoundError(
      `ID가 ${exerciseId}인 운동 마스터 데이터를 찾을 수 없습니다.`
    );
  }

  // 2. (TODO: 추후 사용자 운동 로그 및 통계 데이터를 여기서 통합하여 반환)
  // 현재는 마스터 데이터만 반환합니다.

  return exercise;
};

module.exports = {
  getExerciseList,
  getExerciseDetail,
};
