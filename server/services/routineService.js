// services/routineService.js

const Routine = require("../models/Routine");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errorHandler");

// 사용자 ID에 해당하는 모든 루틴/챌린지 목록 조회
const getUsersRoutines = async (userId) => {
  // 1. 해당 사용자가 생성한 루틴/챌린지 목록을 최신 순으로 조회
  // 2. 리스트 화면에 필요한 제작자 정보(nickname)를 populate 합니다.
  const routines = await Routine.find({ creator: userId })
    .populate("creator", "nickname")
    .sort({ createdAt: -1 });

  // (컨트롤러에서 mapRoutineToListItem 유틸리티를 사용하여 최종 변환됩니다.)
  return routines;
};

// 특정 루틴/챌린지의 상세 정보 조회 및 접근 권한
const getRoutineDetailById = async (routineId, userId) => {
  const routine = await Routine.findById(routineId).populate(
    "creator",
    "nickname"
  );

  if (!routine) {
    throw new NotFoundError(
      `ID가 ${routineId}인 루틴/챌린지를 찾을 수 없습니다.`
    );
  }

  // 💡 인가 확인: 본인이 만든 루틴/챌린지만 상세 조회 가능
  if (routine.creator._id.toString() !== userId.toString()) {
    throw new UnauthorizedError("해당 루틴/챌린지에 접근할 권한이 없습니다.");
  }

  return routine;
};

// 새로운 루틴/챌린지 생성 및 DB 저장
const createRoutine = async (userId, routineData) => {
  const { name, routineType, exercises, goalWeeks } = routineData;

  // 필수 필드 및 카테고리별 유효성 검사
  if (!name || !routineType || !exercises || exercises.length === 0) {
    throw new BadRequestError("루틴 이름, 카테고리, 운동 정보는 필수입니다.");
  }

  if (routineType === "Challenge") {
    if (!goalWeeks || goalWeeks < 1) {
      throw new BadRequestError(
        "챌린지는 목표 주차(goalWeeks)를 1주 이상 설정해야 합니다."
      );
    }
  } else if (routineType !== "Routine") {
    throw new BadRequestError(
      '카테고리는 "Routine" 또는 "Challenge"여야 합니다.'
    );
  }

  // 루틴의 전체 활동 요일
  const activeDays = [...new Set(exercises.flatMap((ex) => ex.days))];

  // 루틴의 전체 부위
  const parts = [...new Set(exercises.flatMap((ex) => ex.targetMuscles))];

  // 루틴 데이터 생성 및 저장
  const newRoutine = await Routine.create({
    creator: userId,
    name,
    routineType,
    goalWeeks: routineType === "Challenge" ? goalWeeks : undefined,
    activeDays: activeDays,
    parts: parts,
    exercises,
  });

  return newRoutine;
};

// 기존 루틴/챌린지 수정
const updateRoutine = async (routineId, userId, updateData) => {
  // 1. 루틴 존재 여부 확인 및 인가 확인을 위해 findById 사용
  const routine = await Routine.findById(routineId);

  if (!routine) {
    throw new NotFoundError(
      `ID가 ${routineId}인 루틴/챌린지를 찾을 수 없습니다.`
    );
  }

  if (routine.creator.toString() !== userId.toString()) {
    throw new UnauthorizedError("해당 루틴/챌린지를 수정할 권한이 없습니다.");
  }

  // 2. 데이터 유효성 검사 (업데이트 데이터에 대한 추가 검증)
  if (
    updateData.routineType === "Challenge" &&
    (!updateData.goalWeeks || updateData.goalWeeks < 1)
  ) {
    throw new BadRequestError("챌린지는 목표 주차를 1주 이상 설정해야 합니다.");
  }

  // exercises가 포함된 경우 다시 계산하여 업데이트
  if(updateData.exercises){
    updateData.activeDays = [...new Set(updateData.exercises.flatMap((ex) => ex.days))];
    updateData.parts = [...new Set(updateData.exercises.flatMap((ex) => ex.targetMuscles))];
  }

  // 3. 데이터 업데이트 및 저장
  Object.assign(routine, updateData);
  const updatedRoutine = await routine.save();

  return updatedRoutine;
};

// 특정 루틴/챌린지 삭제
const deleteRoutine = async (routineId, userId) => {
  // 삭제와 동시에 인가 확인 (creator 필드까지 확인)
  const routine = await Routine.findOneAndDelete({
    _id: routineId,
    creator: userId,
  });

  if (!routine) {
    // 찾지 못했거나 권한이 없는 경우
    throw new NotFoundError(
      `ID가 ${routineId}인 루틴/챌린지를 찾을 수 없거나 삭제 권한이 없습니다.`
    );
  }

  // 삭제 성공
  return { id: routineId };
};

module.exports = {
  getUsersRoutines,
  getRoutineDetailById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
};
