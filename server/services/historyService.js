const mongoose = require("mongoose");
const ExerciseHistory = require("../models/ExerciseHistory");
const UserGoal = require("../models/UserGoal");
const { mapHistoryToCalendar } = require("../utils/responseMap");

// 운동 기록 추가
const createExerciseHistory = async (userId, exerciseLog, workoutMeta) => {
  const { date, userGoalId, type, title, totalTime } = workoutMeta;

  const updateDoc = {
    $max: { personalBestWeight: exerciseLog.maxWeight || 0 },
    $inc: { totalExerciseCount: 1 },

    $push: {
      records: {
        date: new Date(date),
        relatedUserGoalId: userGoalId || null,
        goalName: title,
        recordType: type,
        totalTime: totalTime,
        sets: exerciseLog.sets,
        maxWeight: exerciseLog.maxWeight,
        totalVolume: exerciseLog.totalVolume,
        totalReps: exerciseLog.totalReps,
        // isCompleted 필드가 sets에 있다면 자동으로 포함됨
      },
    },
  };

  await ExerciseHistory.findOneAndUpdate(
    { userId, exerciseId: exerciseLog.exerciseId },
    updateDoc,
    { upsert: true, new: true, setDefaultsOnInsert: true } // setDefaultsOnInsert 추가
  );
};

// 운동 기록 저장 (운동 완료 시 호출)
const saveWorkoutSession = async (userId, workoutData) => {
  const { date, userGoalId, type, exercises, title, totalTime } = workoutData;

  // 입력 유효성 검사
  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    throw new Error("저장할 운동 기록이 누락되었습니다.");
  }

  const workoutMeta = { date, userGoalId, type, title, totalTime };

  // ExerciseHistory 업데이트
  await Promise.all(
    exercises.map((ex) => createExerciseHistory(userId, ex, workoutMeta))
  );

  // UserGoal 진행도 업데이트
  if (userGoalId) {
    const goal = await UserGoal.findByIdAndUpdate(
      userGoalId,
      { $inc: { completedSessions: 1 } },
      { new: true } // 업데이트된 문서를 반환받기 위해
    );

    if (
      goal &&
      goal.durationWeek &&
      goal.completedSessions >= goal.durationWeek
    ) {
      // 챌린지 주차를 세션 수로 대체한다고 가정하고 단순 비교
      await UserGoal.findByIdAndUpdate(userGoalId, { status: "완료" });
    }
  }
};

// 운동 목록 조회
const getWorkoutSession = async (userId) => {
  // 내 운동 기록 조회
  const exerciseHistory = await ExerciseHistory.find({
    userId: userId,
  }).populate("exerciseId", "name category");

  return exerciseHistory;
};

// 월별 캘린더 데이터 조회 (Aggregation)
const getMonthlyHistory = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const rawHistory = await ExerciseHistory.aggregate([
    // 내 기록 중 기간 내 데이터 필터링
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        "records.date": { $gte: startDate, $lte: endDate },
      },
    },
    { $unwind: "$records" },
    { $match: { "records.date": { $gte: startDate, $lte: endDate } } },

    // 운동 정보 Join
    {
      $lookup: {
        from: "exercises",
        localField: "exerciseId",
        foreignField: "_id",
        as: "exerciseInfo",
      },
    },
    { $unwind: "$exerciseInfo" },

    // 날짜별 + 세션별 그룹화 (재조립)
    {
      $group: {
        _id: {
          date: "$records.date",
          type: "$records.recordType",
          goalId: "$records.relatedUserGoalId",
        },
        title: { $first: "$records.goalName" },
        totalTime: { $max: "$records.totalTime" },
        targetMuscles: { $addToSet: "$exerciseInfo.category" },
        exercises: {
          $push: {
            name: "$exerciseInfo.name",
            isCompleted: { $allElementsTrue: ["$records.sets.isCompleted"] },
          },
        },
      },
    },
    { $sort: { "_id.date": -1 } },
  ]);

  return mapHistoryToCalendar(rawHistory);
};

module.exports = {
  createExerciseHistory,
  getWorkoutSession,
  saveWorkoutSession,
  getMonthlyHistory,
};
