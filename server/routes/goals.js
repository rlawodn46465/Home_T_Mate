// routes/goals.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getGoals,
  finishGoal,
  createGoal,
  getGoalDetail,
  updateGoal,
  deleteGoal,
  getExerciseRecords,
  getTodayGoals,
  getUserGoalDetail,
} = require("../controllers/goalController");

// 루틴/챌린지 목록 조회 (GET /api/v1/goals)
router.get("/", protect, getGoals);

// 특정 날짜의 모든 운동 기록 조회 (GET /api/v1/goals/records?date=YYYY-MM-DD)
router.get("/records", protect, getExerciseRecords);

// 오늘 목표 조회 (GET /api/v1/goals/today)
router.get("/today", protect, getTodayGoals);

// 루틴/챌린지 생성 (POST /api/v1/goals)
router.post("/", protect, createGoal);

// 목표 종료 (PATCH /api/v1/goals/:routineId/finish)
router.patch("/:routineId/finish", protect, finishGoal);

// 특정 루틴/챌린지 상세 조회 (GET /api/v1/goals/:routineId)
router.get("/:routineId", protect, getGoalDetail);

// 특정 루틴/챌린지 수정 (PUT /api/v1/goals/:routineId)
router.put("/:routineId", protect, updateGoal);

// 특정 루틴/챌린지 삭제 (DELETE /api/v1/goals/:routineId)
router.delete("/:routineId", protect, deleteGoal);

// 다운로드 한 목표 관리
router.get("/:userGoalId", protect, getUserGoalDetail);

module.exports = router;
