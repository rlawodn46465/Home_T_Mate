const asyncHandler = require('../utils/asyncHandler');
const exerciseService = require('../services/exerciseService');
const { BadRequestError } = require('../utils/errorHandler');

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

  const detailData = await exerciseService.getExerciseDetail(exerciseId, userId);

  res.status(200).json({
    success: true,
    data: detailData,
  });
});

module.exports = {
  getExerciseDetailController,
};
