// routes/exercises.js

const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getExerciseDetailController, 
    getExerciseListController
} = require('../controllers/exerciseController');

// 운동 목록 조회 (GET /api/v1/exercises)
router.get("/", protect, getExerciseListController);

// 운동 상세 정보 조회 (GET /api/v1/exercises/:id)
router.get("/:id", protect, getExerciseDetailController);

module.exports = router;