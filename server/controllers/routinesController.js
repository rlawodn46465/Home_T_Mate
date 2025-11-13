const asyncHandler = require("express-async-handler");
const Routine = require("../models/Routine"); // 위에서 정의한 Mongoose 모델
const User = require("../models/User"); // 사용자 정보를 가져오기 위한 모델 (protect 미들웨어에서 확보된 정보 확인용)
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errorHandler");
const {
  mapRoutineToListItem,
  mapRoutineToDetail,
} = require("../utils/routineUtils");

// 사용자 루틴/챌린지 목록 조회 (GET /api/v1/routines)
const getRoutines = asyncHandler(async (req, res) => {
  // 💡 Service 호출: DB 접근 로직을 Service로 위임
  const routines = await routineService.getUsersRoutines(req.user._id);

  // 응답 데이터 변환: 프론트엔드 리스트 형식에 맞게 변환 (Utils 사용)
  const routineListItems = routines.map(mapRoutineToListItem);

  res.status(200).json({
    success: true,
    count: routineListItems.length,
    data: routineListItems, // 목록 화면에 필요한 핵심 정보만 포함
  });
});

// 특정 루틴/챌린지 상세 조회 (GET /api/v1/routines/:routineId)
const getRoutineDetail = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  // 💡 Service 호출: DB 접근 및 인가 확인 로직을 Service로 위임
  const routine = await routineService.getRoutineDetailById(
    routineId,
    req.user._id
  );

  // 응답 데이터 변환: 프론트엔드 상세 페이지 형식에 맞게 변환 (Utils 사용)
  const routineDetail = mapRoutineToDetail(routine);

  res.status(200).json({
    success: true,
    data: routineDetail, // 상세 화면에 필요한 모든 정보 포함
  });
});

// 새 루틴/챌린지 생성 (POST /api/v1/routines)
const createRoutine = asyncHandler(async (req, res) => {
  // 💡 Service 호출: 생성 및 유효성 검사 로직을 Service로 위임
  const newRoutine = await routineService.createRoutine(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: "루틴/챌린지 생성 성공",
    id: newRoutine._id, // 생성된 루틴의 ID 반환
  });
});

// 기존 루틴/챌린지 수정 (PUT /api/v1/routines/:routineId)
const updateRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  // 💡 Service 호출: 수정 및 인가 확인 로직을 Service로 위임
  const updatedRoutine = await routineService.updateRoutine(
    routineId,
    req.user._id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "루틴/챌린지 수정 성공",
    id: updatedRoutine._id,
  });
});

// 특정 루틴/챌린지 삭제 (DELETE /api/v1/routines/:routineId)
const deleteRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  // 💡 Service 호출: 삭제 및 인가 확인 로직을 Service로 위임
  await routineService.deleteRoutine(routineId, req.user._id);

  res.status(200).json({
    success: true,
    message: "루틴/챌린지 삭제 성공",
    id: routineId,
  });
});

module.exports = {
  getRoutines,
  getRoutineDetail,
  createRoutine,
  updateRoutine,
  deleteRoutine,
};
