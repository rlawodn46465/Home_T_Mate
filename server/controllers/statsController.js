// controllers/statsController.js

const asyncHandler = require("../utils/asyncHandler");
const statService = require("../services/statService");
const { successResponse } = require("../utils/response");

// GET /api/v1/stats/weekly
const getWeeklyStats = asyncHandler(async (req, res) => {
  const weeklyStats = await statService.getWeeklyStats(req.user.id);
  return successResponse(res, weeklyStats);
});

// GET /api/v1/stats/weight
const getWeightStats = asyncHandler(async (req, res) => {
  const weightStats = await statService.getWeightStats(req.user.id);
  return successResponse(res, weightStats);
});

module.exports = { getWeeklyStats, getWeightStats };
