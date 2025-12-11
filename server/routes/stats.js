const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getWeeklyStats,
  getWeightStats,
} = require("../controllers/statsController");

// 이번주 운동한 날
// 이번주 운동한 부위
// 이번주에 한 운동들의 운동한 시간의 평균 시간(분)
// 오늘 운동한 시간(분)
// (GET /api/v1/stats/weekly)
router.get("/weekly", protect, getWeeklyStats);

// - 이번주 운동한거 부위별 무게 + 역대 부위별 최대 무게
// (GET /api/v1/stats/weight)
router.get("/weight", protect, getWeightStats);

module.exports = router;