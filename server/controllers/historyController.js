// controllers/historyController.js

const asyncHandler = require("../utils/asyncHandler");
const historyService = require("../services/historyService");
const { successResponse } = require("../utils/response");

// GET /api/v1/history (운동 목록 조회)
const getWorkout = asyncHandler(async (req, res) => {
  const historys = await historyService.getWorkoutSession(req.user._id);
  return successResponse(res, historys);
});

// POST /api/v1/history (운동 완료 시 기록 저장)
const saveWorkout = asyncHandler(async (req, res) => {
  await historyService.saveWorkoutSession(req.user._id, req.body);
  return successResponse(res, null, { message: "운동이 기록되었습니다." });
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

  return successResponse(res, calendarData);
});

// GET /api/v1/history/:recordId (단일 운동 기록 조회)
const getSingleRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;
  const record = await historyService.getWorkoutRecordById(
    req.user._id,
    recordId
  );

  return successResponse(res, record);
});

// UT /api/v1/history/:recordId (운동 기록 수정)
const updateRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;
  const updatedData = req.body;

  await historyService.updateWorkoutRecord(req.user._id, recordId, updatedData);
  return successResponse(res, null, { message: "운동 기록이 수정되었습니다." });
});

// DELETE /api/v1/history/:recordId (운동 기록 삭제)
const deleteRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  await historyService.deleteWorkoutRecord(req.user._id, recordId);
  return successResponse(res, null, { message: "운동 기록이 삭제되었습니다." });
});

module.exports = {
  getWorkout,
  saveWorkout,
  getCalendar,
  getSingleRecord,
  updateRecord,
  deleteRecord,
};
