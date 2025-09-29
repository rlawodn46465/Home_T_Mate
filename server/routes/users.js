const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const userService = require("../services/userService");
const { BadRequestError } = require("../utils/errorHandler");

// 사용자 목록 조회 (GET /api/users)
router.get("/", asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
}));

// 새 사용자 생성 (POST /api/users)
router.post("/", asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new BadRequestError("이름과 이메일은 필수입니다.");
  }

  const savedUser = await userService.createUser({ name, email });

  res.status(201).json({
    message: "사용자가 성공적으로 생성됨",
    user: savedUser,
  });
}));

module.exports = router;
