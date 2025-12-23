// controllers/goalController.js

const asyncHandler = require("../utils/asyncHandler");
const goalService = require("../services/goalService");
const { mapGoalToDetail } = require("../utils/responseMap");
const { BadRequestError } = require("../utils/errorHandler");
const { successResponse } = require("../utils/response");

// GET /api/v1/goals (목표 목록)
const getGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.getUserGoals(req.user._id);
  return successResponse(res, goals);
});

// GET /api/v1/goals/records?date=YYYY-MM-DD (특정 날짜 목표 불러오기)
const getExerciseRecords = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const userId = req.user._id;

  if (!date) throw new BadRequestError("date 쿼리가 필요합니다.");
  if (!/\d{4}-\d{2}-\d{2}/.test(date))
    throw new BadRequestError("날짜 형식 오류");

  const records = await goalService.getDailyExerciseRecords(userId, date);
  return successResponse(res, records);
});

// GET /api/v1/goals/:id (상세)
const getGoalDetail = asyncHandler(async (req, res) => {
  const goal = await goalService.getGoalDetail(req.params.routineId);
  return successResponse(res, mapGoalToDetail(goal));
});

// GET /api/v1/goals/today
const getTodayGoals = asyncHandler(async (req, res) => {
  const todayGoals = await goalService.getTodayGoals(req.user.id);
  return successResponse(res, todayGoals);
});

// POST /api/v1/goals (생성)
const createGoal = asyncHandler(async (req, res) => {
  const newGoal = await goalService.createGoal(req.user._id, req.body);
  return successResponse(
    res,
    { id: newGoal._id },
    { message: "목표가 생성되었습니다." }
  );
});

// PUT /api/v1/goals/:id (수정)
const updateGoal = asyncHandler(async (req, res) => {
  const updated = await goalService.updateGoal(
    req.params.routineId,
    req.user._id,
    req.body
  );
  return successResponse(
    res,
    { id: updated._id },
    { message: "목표가 수정되었습니다." }
  );
});

// DELETE /api/v1/goals/:id (삭제)
const deleteGoal = asyncHandler(async (req, res) => {
  await goalService.deleteGoal(req.params.routineId, req.user._id);
  return successResponse(res, null, { message: "삭제되었습니다." });
});

// GET /api/v1/goals/:userGoalId (다운로드한 목표 관리)
const getUserGoalDetail = asyncHandler(async (req, res) => {
  const { userGoalId } = req.params;
  const userId = req.user._id;

  const result = await goalService.getUserGoalDetail(userGoalId, userId);

  return successResponse(res, result);
});

module.exports = {
  getGoals,
  getGoalDetail,
  createGoal,
  updateGoal,
  deleteGoal,
  getExerciseRecords,
  getTodayGoals,
  getUserGoalDetail,
};
