const mongoose = require("mongoose");
const ExerciseHistory = require("../models/ExerciseHistory");
const UserGoal = require("../models/UserGoal");
const { mapHistoryToCalendar } = require("../utils/responseMap");

// 운동 기록 저장 (운동 완료 시 호출)
const saveWorkoutSession = async (userId, workoutData) => {
  const { date, userGoalId, type, exercises, title, totalTime } = workoutData;

  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    return; // 저장할 운동이 없으면 종료
  }

  await Promise.all(
    exercises.map(async (ex) => {
      const updateDoc = {
        $setOnInsert: { personalMemo: "" },
        $max: { personalBestWeight: ex.maxWeight || 0 },
        $inc: { totalExerciseCount: 1 },
        $push: {
          records: {
            date: new Date(date),
            relatedUserGoalId: userGoalId || null,
            goalName: title,
            recordType: type,
            totalTime: totalTime,
            sets: ex.sets,
            maxWeight: ex.maxWeight,
            totalVolume: ex.totalVolume,
            totalReps: ex.totalReps,
          },
        },
      };

      await ExerciseHistory.findOneAndUpdate(
        { userId, exerciseId: ex.exerciseId },
        updateDoc,
        { upsert: true, new: true }
      );
    })
  );

  // 챌린지/루틴 진행 중이었다면 진행도 업데이트
  if (userGoalId) {
    await UserGoal.findByIdAndUpdate(userGoalId, {
      $inc: { completedSessions: 1 },
      // currentWeek 업데이트 추가 가능
    });
  }
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

module.exports = { saveWorkoutSession, getMonthlyHistory };