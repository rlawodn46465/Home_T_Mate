// controllers/exerciseController.js

const asyncHandler = require("../utils/asyncHandler");
const exerciseService = require("../services/exerciseService");
// const { BadRequestError } = require("../utils/errorHandler");

// 전체 운동 목록 조회 (GET /api/v1/exercises)
const getExerciseListController = asyncHandler(async (req, res) => {
  // 쿼리 파라미터에서 검색 및 필터 옵션 추출
  const filterOptions = {
    search: req.query.search,
    part: req.query.part,
    tool: req.query.tool,
  }; // 서비스 로직 위임
  const exercises = await exerciseService.getExerciseList(filterOptions);
  res.status(200).json({ success: true, data: exercises });
});

// 특정 운동 상세 정보[운동 정보, 사용자 통계, 최근 로그] (GET /api/v1/exercises/:id)
const getExerciseDetailController = asyncHandler(async (req, res) => {
  // const exerciseId = req.params.id;
  // const userId = req.user._id;

  // if (!exerciseId) {
  //   throw new BadRequestError("운동 ID가 필요합니다.");
  // }

  const data = await exerciseService.getExerciseDetail(
    req.params.id,
    req.user._id
  );
  res.status(200).json({ success: true, data });
});

module.exports = {
  getExerciseListController,
  getExerciseDetailController,
};
