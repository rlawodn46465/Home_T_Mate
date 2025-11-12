// routes/routines.js
const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createRoutineController } = require('../controllers/exerciseController'); // exerciseController에 같이 정의

// 루틴/챌린지 생성 (POST /api/v1/routines)
router.post("/", protect, createRoutineController);

// 루틴 조회, 수정, 삭제 라우트 등을 여기에 추가

module.exports = router;