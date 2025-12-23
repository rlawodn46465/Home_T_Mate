// services/statService.js

const mongoose = require("mongoose");
const ExerciseHistory = require("../models/ExerciseHistory");
const Exercise = require("../models/Exercise");

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const getWeekRange = () => {
  const now = new Date();
  const today = now.getDay();

  // 일요일 (주의 시작)
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - today);
  startDate.setHours(0, 0, 0, 0);

  // 토요일 (주의 종료)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

// 주간 운동 통계 조회
const getWeeklyStats = async (userId) => {
  const { startDate, endDate } = getWeekRange();
  const now = new Date();
  const todayIdx = now.getDay(); // 0~6 (일~토)
  const userIdObj = new mongoose.Types.ObjectId(userId);

  const histories = await ExerciseHistory.aggregate([
    { $match: { userId: userIdObj } },
    { $unwind: "$records" },
    {
      $match: {
        "records.date": { $gte: startDate, $lte: endDate },
      },
    },
    {
      $lookup: {
        from: Exercise.collection.name,
        localField: "exerciseId",
        foreignField: "_id",
        as: "exerciseInfo",
      },
    },
    { $unwind: "$exerciseInfo" },
  ]);

  // 운동한 근육 부위 목록
  const weeklyTargetMuscles = [
    ...new Set(histories.flatMap((h) => h.exerciseInfo.targetMuscles)),
  ];

  // 요일별 시간 계산
  const weekData = Array(7)
    .fill(null)
    .map((_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const dateString = d.toISOString().split("T")[0];

      const dayRecords = histories.filter((h) => {
        const recordDateString = h.records.date.toISOString().split("T")[0];
        return recordDateString === dateString;
      });

      return {
        date: d.getDate(),
        day: DAYS[i],
        minutes: Math.round(
          dayRecords.reduce((sum, r) => sum + r.records.totalTime, 0) / 60
        ),
        isToday: i === todayIdx,
        isWorkout: dayRecords.length > 0,
      };
    });

  // 주 평균 시간
  const totalMinutes = histories.reduce(
    (sum, r) => sum + r.records.totalTime,
    0
  );
  const workoutDays = new Set(histories.map((r) => r.records.date.getDay()));
  const avgMinutes =
    workoutDays.size > 0 ? Math.round(totalMinutes / 60 / workoutDays.size) : 0;

  const todayMinutes = weekData[todayIdx].minutes;

  return {
    currentWeek: weekData,
    todayMinutes,
    weeklyAverageMinutes: avgMinutes,
    weeklyTargetMuscles,
  };
};

// 부위별 무게 통계 조회
const getWeightStats = async (userId) => {
  const { startDate, endDate } = getWeekRange();
  const userIdObj = new mongoose.Types.ObjectId(userId);

  const parts = ["등", "어깨", "팔", "가슴", "하체", "코어"];

  const aggregation = await ExerciseHistory.aggregate([
    { $match: { userId: userIdObj } },
    {
      $lookup: {
        from: Exercise.collection.name,
        localField: "exerciseId",
        foreignField: "_id",
        as: "exerciseInfo",
      },
    },
    { $unwind: "$exerciseInfo" },
    { $unwind: "$exerciseInfo.category" },
    { $unwind: "$records" },
    {
      $group: {
        _id: "$exerciseInfo.category",
        maxWeight: { $max: "$records.maxWeight" },
        weeklyWeight: {
          $max: {
            $cond: [
              {
                $and: [
                  { $gte: ["$records.date", startDate] },
                  { $lte: ["$records.date", endDate] },
                ],
              },
              "$records.maxWeight",
              0,
            ],
          },
        },
      },
    },
  ]);

  const map = aggregation.reduce((acc, cur) => {
    acc[cur._id] = {
      current: cur.weeklyWeight || 0,
      max: cur.maxWeight || 0,
    };
    return acc;
  }, {});

  return parts.map((part) => ({
    part,
    current: map[part]?.current ?? 0,
    max: map[part]?.max ?? 0,
  }));
};

module.exports = { getWeeklyStats, getWeightStats };
