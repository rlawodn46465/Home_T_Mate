// controllers/goalController.js

const asyncHandler = require("../utils/asyncHandler");
const goalService = require("../services/goalService");
const { mapGoalToListItem, mapGoalToDetail } = require("../utils/responseMap");
// const routineService = require("../services/routineService");

// GET /api/v1/goals (목표 목록)
const getGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.getUserGoals(req.user._id);
  // const routineListItems = routines.map(mapRoutineToListItem);

  res.status(200).json({ success: true, data: goals.map(mapGoalToListItem) });
});

// GET /api/v1/goals/:id (상세)
const getGoalDetail = asyncHandler(async (req, res) => {
  // const { routineId } = req.params;
  const goal = await goalService.getGoalDetail(req.params.routineId);

  res.status(200).json({ success: true, data: mapGoalToDetail(goal) });
});

// POST /api/v1/goals (생성)
const createGoal = asyncHandler(async (req, res) => {
  // 프론트에서 받아온 데이터
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
};
