const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getWorkout,
  saveWorkout,
  getCalendar,
} = require("../controllers/historyController");

// 운동 기록 목록
router.get("/", protect, getWorkout);

// 운동 기록 저장
router.post("/", protect, saveWorkout);

// 달력 조회
router.get("/calendar", protect, getCalendar);

module.exports = router;
