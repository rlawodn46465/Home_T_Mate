// controllers/historyController.js

const asyncHandler = require("../utils/asyncHandler");
const historyService = require("../services/historyService");

// GET /api/v1/history (운동 목록 조회)
const getWorkout = asyncHandler(async (req, res) => {
  const historys = await historyService.getWorkoutSession(req.user._id);
  res.status(200).json({ success: true, data: historys });
});

// POST /api/v1/history (운동 완료 시 기록 저장)
const saveWorkout = asyncHandler(async (req, res) => {
  await historyService.saveWorkoutSession(req.user._id, req.body);
  res.status(201).json({ success: true, message: "운동이 기록되었습니다." });
});

// GET /api/v1/history/calendar?year=2024&month=5 (달력 조회)
const getCalendar = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  if (!year || !month) throw new Error("년/월 정보가 필요합니다.");

  const calendarData = await historyService.getMonthlyHistory(
    req.user._id,
    parseInt(year),
    parseInt(month)
  );

  res.status(200).json({ success: true, data: calendarData });
});

module.exports = { getWorkout, saveWorkout, getCalendar };