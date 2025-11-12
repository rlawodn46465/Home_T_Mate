const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");
const userRouter = require("./routes/users");
const authRouter = require('./routes/auth');
const exerciseRouter = require('./routes/exercises'); 
const routineRouter = require('./routes/routines');

// DB 연결 실행
connectDB();
// 서버 초기 설정
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cookieParser());
app.use(express.json());
// URL-encoded 요청 본문을 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: true }));


// API 라우트 연결
app.use("/api/v1/users", userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/exercises', exerciseRouter);
app.use('/api/v1/routines', routineRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "서버 실행",
    status: "Running",
  });
});

// 최종 요청 처리
app.use((req, res, next) => {
  const { NotFoundError } = require('./utils/errorHandler');
  const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log("서버를 멈추기 위해서는 Ctrl+C를 누르세요.");
});
