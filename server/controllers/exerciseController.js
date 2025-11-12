const asyncHandler = require("../utils/asyncHandler");
const exerciseService = require("../services/exerciseService");
const routineService = require("../services/routineService");
const { BadRequestError } = require("../utils/errorHandler");

/**
 * @description 전체 운동 목록을 조회하는 컨트롤러
 * GET /api/v1/exercises
 */
const getExerciseListController = asyncHandler(async (req, res) => {
  // 쿼리 파라미터에서 검색 및 필터 옵션 추출
  const filterOptions = {
    search: req.query.search,
    category: req.query.category,
  };

  const exercises = await exerciseService.getExerciseList(filterOptions);

  res.status(200).json({
    success: true,
    count: exercises.length,
    data: exercises,
  });
});

/**
 * @description 새로운 루틴/챌린지를 생성하는 컨트롤러
 * POST /api/v1/routines
 */
const createRoutineController = asyncHandler(async (req, res) => {
  const userId = req.user._id; // protect 미들웨어를 통해 설정된 사용자 ID
  const routineData = req.body;

  // 서비스 로직 위임 (유효성 검사 및 DB 저장)
  const savedRoutine = await routineService.createRoutine(userId, routineData);

  res.status(201).json({
    success: true,
    message: "루틴/챌린지가 성공적으로 저장되었습니다.",
    data: savedRoutine,
  });
});

/**
 * @description 특정 운동의 상세 정보(운동 정보, 사용자 통계, 최근 로그)를 가져오는 컨트롤러
 * GET /api/v1/exercises/:id
 */
const getExerciseDetailController = asyncHandler(async (req, res) => {
  const exerciseId = req.params.id;
  const userId = req.user._id; // protect 미들웨어를 통해 설정된 사용자 ID

  if (!exerciseId) {
    throw new BadRequestError("운동 ID가 필요합니다.");
  }

  const detailData = await exerciseService.getExerciseDetail(
    exerciseId,
    userId
  );

  res.status(200).json({
    success: true,
    data: detailData,
  });
});

module.exports = {
  getExerciseListController,
  getExerciseDetailController,
  createRoutineController,
};
