// routes/users.js

const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();
const userService = require("../services/userService");
const { BadRequestError } = require("../utils/errorHandler");
const { protect } = require('../middlewares/authMiddleware');

// 사용자 목록 조회 (GET /api/users)
router.get("/", protect ,asyncHandler(async (req, res) => {
  // 인증 미들웨어(protect)를 통과한 경우, req.user 객체에 사용자 정보가 담겨 있음
  console.log(`[인증된 사용자] ID: ${req.user._id}, Name: ${req.user.name} 접근 권한 부여.`);
  
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
}));

// 새 사용자 생성 (POST /api/users)
router.post("/", asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // 입력값 유효성 검사
  if (!name || !email) {
    throw new BadRequestError("이름과 이메일은 필수입니다.");
  }

  // 비즈니스 로직 위임 및 사용자 생성
  const savedUser = await userService.createUser({ name, email });

  res.status(201).json({
    message: "사용자가 성공적으로 생성됨",
    user: savedUser,
  });
}));

module.exports = router;
