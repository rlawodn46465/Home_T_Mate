// services/goalService.js

const Goal = require("../models/Goal");
const UserGoal = require("../models/UserGoal");

const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errorHandler");

// 사용자 목표 목록 조회
const getUserGoals = async (userId) => {
  // 내가 만든 Goal 조회
  const userGoals = await UserGoal.find({ userId: userId })
    .populate({
      path: "goalId",
      select: "name goalType parts creatorId",
      populate: { path: "creatorId", select: "nickname" },
    })
    .sort({ createdAt: -1 });

  const combinedGoals = userGoals
    .map((ug) => {
      const goalInfo = ug.goalId;
      if (!goalInfo) return null;

      return {
        _id: ug._id,
        userId: ug.userId,
        status: ug.status,
        startDate: ug.startDate,
        currentWeek: ug.currentWeek,
        completedSessions: ug.completedSessions,
        activeDays: ug.activeDays,
        customExercises: ug.customExercises,

        originalGoalId: goalInfo._id, // 원본 ID 보존
        name: goalInfo.name, // 루틴 이름
        goalType: goalInfo.goalType, // 타입
        parts: goalInfo.parts, // 운동 부위
        creator: goalInfo.creatorId, // 제작자 정보

        createdAt: ug.createdAt,
      };
    })
    .filter((item) => item !== null);

  return combinedGoals;
};

// 목표 상세 조회
const getGoalDetail = async (goalId) => {
  // 운동 정보 채우기
  const userGoal = await UserGoal.findById(goalId)
    .populate({
      path: "goalId",
      select: "name goalType parts creatorId",
      populate: { path: "creatorId", select: "nickname" },
    })
    .populate({
      path: "customExercises.exerciseId",
      select: "name targetMuscles",
    });

  if (!userGoal)
    throw new NotFoundError("해당 루틴/챌린지를 찾을 수 없습니다.");
  return userGoal;
};

// 목표 생성
const createGoal = async (userId, goalData) => {
  const { name, goalType, exercises, durationWeek, isUserPublic } = goalData;

  // 요약 정보 자동 생성
  const parts = [...new Set(exercises.flatMap((ex) => ex.targetMuscles || []))];
  const activeDays = [
    ...new Set(exercises.flatMap((ex) => ex.days || [])),
  ].sort();

  // 루틴 데이터 생성 및 저장
  const newGoal = await Goal.create({
    creatorId: userId,
    name,
    goalType,
    durationWeek: goalType === "CHALLENGE" ? durationWeek : undefined,
    isUserPublic,
    parts,
    exercises,
  });

  try {
    await UserGoal.create({
      userId: userId, // 제작자 본인
      goalId: newGoal._id, // 방금 만든 Goal의 ID 연결

      isModified: false, // 막 만들었으므로 원본과 동일함
      status: "진행중", // 바로 진행 상태로 시작
      startDate: new Date(), // 시작일은 오늘

      // 챌린지 관련 정보 매핑
      durationWeek: newGoal.durationWeek,
      currentWeek: 1, // 1주차부터 시작
      completedSessions: 0, // 완료 횟수 0
      activeDays: activeDays, // 위에서 계산한 활동 요일

      // 운동 목록 복사
      customExercises: exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        days: ex.days,
        restTime: ex.restTime,
        sets: ex.sets.map((s) => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps,
        })),
      })),
    });
  } catch (error) {
    console.error("목표 생성 후 기록 저장 실패:", error);
  }

  return newGoal;
};

// 목표 수정 (추가 수정 필요)
const updateGoal = async (goalId, userId, updateData) => {
  const userGoal = await UserGoal.findById(goalId);

  if (!userGoal)
    throw new NotFoundError("해당 루틴/챌린지를 찾을 수 없습니다.");

  // 권한 확인
  if (userGoal.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError("수정할 권한이 없습니다.");
  }

  // 데이터 업데이트
  if (updateData.exercises) {
    userGoal.customExercises = updateData.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      days: ex.days,
      restTime: ex.restTime,
      sets: ex.sets.map((s) => ({
        setNumber: s.setNumber,
        weight: s.weight,
        reps: s.reps,
      })),
    }));

    // 활동 요일 재계산
    const allDays = userGoal.customExercises.flatMap((ex) => ex.days || []);
    userGoal.activeDays = [...new Set(allDays)].sort();

    // 원본과 달라졌음을 표시
    userGoal.isModified = true;
  }

  // 기타 필드 업데이트
  if (updateData.durationWeek) {
    userGoal.durationWeek = updateData.durationWeek;
  }

  // 저장
  await userGoal.save();

  return userGoal;
};

// 목표 삭제
const deleteGoal = async (userGoalId, userId) => {
  // usergoal 소유주 확인
  const userGoal = await UserGoal.findOne({
    _id: userGoalId,
    userId: userId,
  });

  if (!userGoal) {
    throw new NotFoundError("삭제할 목표가 없거나 권한이 없습니다.");
  }

  const goalId = userGoal.goalId;
  const goal = await Goal.findById(goalId);

  if (!goal) {
    await UserGoal.deleteOne({ _id: userGoalId });
    return { success: true, message: "원본 목표 없음. 진행 목표만 삭제됨." };
  }

  // Goal 공개 상태 확인
  const { isUserPublic, isBoardPublic } = goal;

  if (isUserPublic || isBoardPublic) {
    await UserGoal.deleteOne({ _id: userGoalId });
  } else {
    // 사용자 최종 확인
    const creatorIdAsString =
      typeof userId === "object" && userId.toString
        ? userId.toString()
        : userId;

    if (goal.creatorId.toString() !== creatorIdAsString) {
      throw new NotFoundError("비공개 목표는 생성자만 삭제할 수 있습니다.");
    }

    // 원본 목표 삭제
    const goalDeletionResult = await Goal.deleteOne({ _id: goalId });

    // 사용자 UserGoal 삭제
    await UserGoal.deleteOne({ _id: userGoalId });

    if (goalDeletionResult.deletedCount === 0) {
      throw new Error("목표 원본 삭제에 실패했습니다.");
    }
  }

  return goal;
};

module.exports = {
  getUserGoals,
  getGoalDetail,
  createGoal,
  updateGoal,
  deleteGoal,
};
