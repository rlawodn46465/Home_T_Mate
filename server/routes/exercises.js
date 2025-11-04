const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getExerciseDetailController } = require('../controllers/exerciseController');

// 모든 운동 관련 라우트에는 사용자 인증(protect)이 필요하다고 가정합니다.

// 운동 상세 정보 조회 (GET /api/v1/exercises/:id)
// 로그인된 사용자만 접근 가능
router.get("/:id", protect, getExerciseDetailController);

// TODO: 운동 로그 추가 라우트 (POST /api/v1/exercises/:id/log) 등을 여기에 추가해야 합니다.

module.exports = router;
