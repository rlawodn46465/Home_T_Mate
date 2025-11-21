// routes/exercises.js

const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getExerciseDetailController, 
    getExerciseListController
} = require('../controllers/exerciseController');

// 모든 운동 관련 라우트에는 사용자 인증(protect)이 필요하다고 가정합니다.

// 운동 목록 조회 (GET /api/v1/exercises)
// 쿼리 파라미터를 통해 필터링/검색 가능
router.get("/", protect, getExerciseListController);

// 운동 상세 정보 조회 (GET /api/v1/exercises/:id)
// 로그인된 사용자만 접근 가능
router.get("/:id", protect, getExerciseDetailController);

module.exports = router;