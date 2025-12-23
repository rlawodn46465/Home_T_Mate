// controllers/exerciseController.js

const asyncHandler = require("../utils/asyncHandler");
const exerciseService = require("../services/exerciseService");
const { successResponse } = require("../utils/response");

// 전체 운동 목록 조회 (GET /api/v1/exercises)
const getExerciseListController = asyncHandler(async (req, res) => {
  // 쿼리 파라미터에서 검색 및 필터 옵션 추출
  const filterOptions = {
    search: req.query.search,
    part: req.query.part,
    tool: req.query.tool,
  }; // 서비스 로직 위임
  const exercises = await exerciseService.getExerciseList(filterOptions);
  return successResponse(res, exercises);
});

// 특정 운동 상세 정보[운동 정보, 사용자 통계, 최근 로그] (GET /api/v1/exercises/:id)
const getExerciseDetailController = asyncHandler(async (req, res) => {
  const data = await exerciseService.getExerciseDetail(
    req.params.id,
    req.user._id
  );
  return successResponse(res, data);
});

module.exports = {
  getExerciseListController,
  getExerciseDetailController,
};
