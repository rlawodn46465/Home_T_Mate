// services/exerciseService.js

const Exercise = require("../models/Exercise");
const ExerciseHistory = require("../models/ExerciseHistory");
const { NotFoundError } = require("../utils/errorHandler");

// 필터 옵션에 따라 운동 마스터 목록 조회
const getExerciseList = async (filterOptions) => {
  const { search, part, tool } = filterOptions;
  const query = {};

  // 검색어 필터링 (search)
  if (search) query.name = { $regex: search, $options: "i" };
  // 운동 부위 필터링 (part)
  if (part) query.targetMuscles = part;
  // 운동 기구 필터링 (tool)
  if (tool) query.equipment = tool;

  // 이름 오름차순으로 정렬하여 반환
  const exercises = await Exercise.find(query).sort({ name: 1 });
  return exercises;
};

// 운동 상세 + 내 기록 반환
const getExerciseDetail = async (exerciseId, userId) => {
  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) throw new NotFoundError(`운동 정보가 없습니다.`);

  // 내 기록 조회
  const history = await ExerciseHistory.findOne({ userId, exerciseId });

  return {
    info: exercise,
    userStats: history
      ? {
          personalMemo: history.personalMemo,
          personalBestWeight: history.personalBestWeight,
          totalCount: history.totalExerciseCount,
          recentRecords: history.records.slice(-5).reverse(), // 최근 5개 기록
        }
      : null,
  };
};

module.exports = {
  getExerciseList,
  getExerciseDetail,
};
