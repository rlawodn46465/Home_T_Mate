// routes/history.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getWorkout,
  saveWorkout,
  getCalendar,
  getSingleRecord,
  updateRecord, 
  deleteRecord,
} = require("../controllers/historyController");

// 운동 기록 목록
router.get("/", protect, getWorkout);

// 운동 기록 저장
router.post("/", protect, saveWorkout);

// 달력 조회
router.get("/calendar", protect, getCalendar);

// 특정 기록 단일 조회
router.get("/:recordId", protect, getSingleRecord);

// 특정 기록 수정
router.put("/:recordId", protect, updateRecord);

// 특정 기록 삭제
router.delete("/:recordId", protect, deleteRecord);

module.exports = router;