// controllers/goalController.js

const asyncHandler = require("../utils/asyncHandler");
const goalService = require("../services/goalService");
const { mapGoalToDetail } = require("../utils/responseMap");
const { BadRequestError } = require("../utils/errorHandler");

// GET /api/v1/goals (목표 목록)
const getGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.getUserGoals(req.user._id);

  res.status(200).json({ success: true, count: goals.length, data: goals });
});

// GET /api/v1/goals/records?date=YYYY-MM-DD (특정 날짜 목표 불러오기)
const getExerciseRecords = asyncHandler(async (req, res) => {
  const { date } = req.query; // 프론트엔드로부터 날짜(YYYY-MM-DD)를 받음
  const userId = req.user._id;

  if (!date) {
    throw new BadRequestError("조회할 날짜(date) 쿼리 파라미터가 필요합니다.");
  }

  if (!/\d{4}-\d{2}-\d{2}/.test(date)) {
    throw new BadRequestError(
      "날짜 형식이 유효하지 않습니다 (YYYY-MM-DD 형식)."
    );
  }

  const records = await goalService.getDailyExerciseRecords(userId, date);
  console.log(records);
  res.status(200).json({ success: true, data: records });
});

// GET /api/v1/goals/:id (상세)
const getGoalDetail = asyncHandler(async (req, res) => {
  const goal = await goalService.getGoalDetail(req.params.routineId);

  res.status(200).json({ success: true, data: mapGoalToDetail(goal) });
});

// GET /api/v1/goals/today
const getTodayGoals = asyncHandler(async (req, res) => {
  const todayGoals = await goalService.getTodayGoals(req.user.id);
  
  res.status(200).json({ success: true, data: todayGoals });
});

// POST /api/v1/goals (생성)
const createGoal = asyncHandler(async (req, res) => {
  const newGoal = await goalService.createGoal(req.user._id, req.body);
  res.status(201).json({ success: true, id: newGoal._id });
});

// PUT /api/v1/goals/:id (수정)
const updateGoal = asyncHandler(async (req, res) => {
  const updated = await goalService.updateGoal(
    req.params.routineId,
    req.user._id,
    req.body
  );
  console.log(updated);
  res.status(200).json({ success: true, id: updated._id });
});

// DELETE /api/v1/goals/:id (삭제)
const deleteGoal = asyncHandler(async (req, res) => {
  await goalService.deleteGoal(req.params.routineId, req.user._id);
  res.status(200).json({ success: true, message: "삭제되었습니다." });
});

module.exports = {
  getGoals,
  getGoalDetail,
  createGoal,
  updateGoal,
  deleteGoal,
  getExerciseRecords,
  getTodayGoals,
};
