const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  saveWorkout,
  getCalendar,
} = require("../controllers/historyController");

// 운동 기록 저장
router.post("/", protect, saveWorkout);

// 달력 조회
router.get("/calendar", protect, getCalendar);

module.exports = router;
