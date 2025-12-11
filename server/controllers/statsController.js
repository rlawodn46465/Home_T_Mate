const asyncHandler = require("../utils/asyncHandler");
const statService = require("../services/statService");

// GET /api/v1/stats/weekly
const getWeeklyStats = asyncHandler(async (req, res) => {
  const weeklyStats = await statService.getWeeklyStats(req.user.id);
  res.status(200).json({ success: true, data: weeklyStats });
});

// GET /api/v1/stats/weight
const getWeightStats = asyncHandler(async (req, res) => {
  const weightStats = await statService.getWeightStats(req.user.id);
  res.status(200).json({ success: true, data: weightStats });
});

module.exports = { getWeeklyStats, getWeightStats };