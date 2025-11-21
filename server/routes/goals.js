// routes/goals.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getGoals,
  createGoal,
  getGoalDetail,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

// 루틴/챌린지 목록 조회 (GET /api/v1/goals)
router.get("/", protect, getGoals);

// 루틴/챌린지 생성 (POST /api/v1/goals)
router.post("/", protect, createGoal);

// 특정 루틴/챌린지 상세 조회 (GET /api/v1/goals/:routineId)
router.get("/:routineId", protect, getGoalDetail);

// 특정 루틴/챌린지 수정 (PUT /api/v1/goals/:routineId)
router.put("/:routineId", protect, updateGoal);

// 특정 루틴/챌린지 삭제 (DELETE /api/v1/goals/:routineId)
router.delete("/:routineId", protect, deleteGoal);

module.exports = router;