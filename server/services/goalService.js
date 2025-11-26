// services/goalService.js

const Goal = require("../models/Goal");
const UserGoal = require("../models/UserGoal");
const ExerciseHistory = require("../models/ExerciseHistory");
const { calculateGoalProgress } = require("../utils/responseMap");
const { parseISO, startOfDay, endOfDay } = require("date-fns");

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

// 사용자 목표 목록 조회(운동 기록쪽)
const getGoalsAndDailyRecords = async (userId) => {
  const typeMap = {
    ROUTINE: "루틴",
    CHALLENGE: "챌린지",
  };

  const userGoals = await UserGoal.find({ userId: userId })
    .populate({
      path: "goalId",
      select: "name goalType parts creatorId",
      populate: { path: "creatorId", select: "nickname" },
    })
    .populate({
      path: "customExercises.exerciseId",
      select: "name targetMuscles",
    })
    .sort({ createdAt: -1 });

  const combinedGoals = userGoals.map((ug) => {
    const goalInfo = ug.goalId;
    if (!goalInfo) return null;
    const progress = calculateGoalProgress({
      goalType: goalInfo.goalType,
      durationWeek: ug.durationWeek,
      activeDays: ug.activeDays,
      completedSessions: ug.completedSessions,
      currentWeek: ug.currentWeek,
    });

    return {
      _id: ug._id,
      userId: ug.userId,
      status: ug.status,
      activeDays: ug.activeDays,
      startDate: ug.startDate,
      createdAt: ug.createdAt,
      customExercises: ug.customExercises.map((ce) => {
        const exerciseInfo = ce.exerciseId || {};
        return {
          exerciseId: exerciseInfo._id,
          days: ce.days,
          restTime: ce.restTime,
          sets: ce.sets,
          name: exerciseInfo.name || "이름 없음",
          targetMuscles: exerciseInfo.targetMuscles,
        };
      }),
      durationWeek: ug.durationWeek,

      progress: progress,

      originalGoalId: goalInfo._id,
      creator: goalInfo.creatorId?.nickname || "Unknown",
      name: goalInfo.name,
      goalType: typeMap[goalInfo.goalType] || goalInfo.goalType,
      parts: goalInfo.parts,
    };
  });

  return combinedGoals;
};

// 특정 날짜 목표 기록 조회
const getDailyExerciseRecords = async (userId, dateString) => {
  // 날짜 범위 계산
  const targetDate = parseISO(dateString);
  if (isNaN(targetDate.getTime())) {
    // 이미 컨트롤러에서 검증했지만, 서비스에서도 혹시 모를 상황 대비
    throw new BadRequestError("유효하지 않은 날짜 형식입니다.");
  }

  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  // ExerciseHistory 문서에서 해당 날짜에 기록이 있는 모든 항목을 조회
  // 'records.date'가 범위 내에 있고 'userId'가 일치하는 문서 찾기
  const histories = await ExerciseHistory.find({
    userId: userId,
    // $elemMatch를 사용하여 records 배열 내의 특정 조건을 만족하는 요소를 찾습니다.
    records: {
      $elemMatch: {
        date: { $gte: start, $lte: end },
      },
    },
  })
    // 운동의 세부 정보(이름, 타겟 근육)를 채우기 위해 populate
    .populate({
      path: "exerciseId",
      select: "name targetMuscles", // 이름과 운동 부위만 가져옵니다.
    });

  // 데이터 가공 및 필터링
  const dailyRecords = [];

  histories.forEach((history) => {
    if (!history.exerciseId) return; // 운동 정보가 없는 경우 스킵 (데이터 무결성 문제)

    // 해당 날짜에 해당하는 records만 필터링합니다.
    const relevantRecords = history.records.filter((record) => {
      // date-fns의 isSameDay를 사용하거나, 날짜가 start와 end 범위 내에 있는지 확인
      return (
        record.date.getTime() >= start.getTime() &&
        record.date.getTime() <= end.getTime()
      );
    });

    // 프론트엔드가 요구하는 형식에 맞게 데이터 재구성
    relevantRecords.forEach((record) => {
      // 운동 부위를 Exercise 모델의 targetMuscles에서 가져옵니다.
      const parts = history.exerciseId.targetMuscles || [];

      dailyRecords.push({
        id: history._id, // 히스토리 ID (이 운동의 기록 전체 ID)
        recordId: record._id, // 이 날짜의 기록 ID (수정/삭제 시 유용)
        exerciseId: history.exerciseId._id,

        // 🚨 요청하신 필수 정보 🚨
        exerciseName: history.exerciseId.name, // 목표 이름 대신 운동 이름
        recordType: record.recordType, // 운동 타입 (ROUTINE, CHALLENGE, PERSONAL)
        goalName: record.goalName, // 루틴/챌린지 이름 (개별운동 시 null)
        parts: parts, // 운동 부위 (카테고리)

        // 수행 데이터
        sets: record.sets, // 세트 정보 (setNumber, weight, reps, isCompleted)
        totalTime: record.totalTime, // 운동 시간
        isCompleted: record.sets.every((set) => set.isCompleted), // 모든 세트가 완료되었는지 여부

        // 추가 정보
        totalVolume: record.totalVolume,
        maxWeight: record.maxWeight,
        date: record.date,
      });
    });
  });

  // 날짜/시간 순으로 정렬이 필요하다면 여기서 수행
  dailyRecords.sort((a, b) => a.date.getTime() - b.date.getTime());

  return dailyRecords;
};

// 목표 상세 조회
const getGoalDetail = async (goalId) => {
  if (!goalId) {
    throw new BadRequestError("조회할 목표 ID가 누락되었습니다.");
  }

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
  getDailyExerciseRecords,
  getGoalsAndDailyRecords,
};
