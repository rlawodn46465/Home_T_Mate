const mongoose = require("mongoose");
const ExerciseHistory = require("../models/ExerciseHistory");
const UserGoal = require("../models/UserGoal");
const { checkDailySessionCompleted, calculateGoalProgress } = require("../utils/responseMap");

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
  const { date, userGoalId, exercises, ...workoutMeta } = workoutData;
  const workoutInfo = { date, userGoalId, ...workoutMeta };

  // 입력 유효성 검사
  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    throw new Error("저장할 운동 기록이 누락되었습니다.");
  }

  let goal;

  // 세션 카운트 증가 여부 결정 (하루 1회 제한)
  let shouldIncrementSession = false;
  if (userGoalId) {
    const sessionCompletedToday = await checkDailySessionCompleted(
      userId,
      userGoalId,
      date
    );
    if (!sessionCompletedToday) {
      shouldIncrementSession = true;
    }
  }

  // ExerciseHistory 업데이트
  await Promise.all(
    exercises.map((ex) => createExerciseHistory(userId, ex, workoutInfo))
  );

  // UserGoal 진행도 업데이트
  if (userGoalId) {
    if (shouldIncrementSession) { // 하루 운동 제한
      goal = await UserGoal.findByIdAndUpdate(
        userGoalId,
        { $inc: { completedSessions: 1 } },
        { new: true } // 업데이트된 문서를 반환받기 위해
      );
    } else {
      goal = await UserGoal.findById(userGoalId);
    }

    // 목표 완료 처리
    if(goal && goal.goalType === "CHALLENGE"){
      const progress = calculateGoalProgress(goal);

      if(progress >= 1){
        await UserGoal.findByIdAndUpdate(userGoalId, {status: "완료"});
      }
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

    // 운동부위
    {
      $unwind: {
        path: "$exerciseInfo.targetMuscles",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 날짜별 + 세션별 그룹화 (재조립)
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$records.date" },
          },
          type: "$records.recordType",
          goalId: "$records.relatedUserGoalId",
        },
        title: { $first: "$records.goalName" },
        recordType: { $first: "$records.recordType" },
        totalSessionTime: { $max: "$records.totalTime" },

        rawMuscles: { $addToSet: "$exerciseInfo.targetMuscles" },

        exercises: {
          $push: {
            exerciseId: "$exerciseId",
            name: "$exerciseInfo.name",
            targetMuscles: "$exerciseInfo.targetMuscles",
            totalTime: "$records.totalTime",
            sets: "$records.sets",
          },
        },
      },
    },
    {
      $project: {
        _id: 0, // 기본 _id 제거
        date: "$_id.date", // 그룹핑 기준이었던 날짜
        recordType: "$recordType", // 운동 타입
        goalId: "$_id.goalId", // 목표 ID
        title: "$title", // 목표 이름
        totalSessionTime: "$totalSessionTime", // 세션 총 시간
        exercises: "$exercises", // 운동 상세 목록

        // 6개 그룹 카테고리 생성 로직: rawMuscles 배열을 순회하며 매핑
        categoryGroup: {
          $reduce: {
            input: "$rawMuscles",
            initialValue: [],
            in: {
              $let: {
                vars: {
                  mappedCategory: {
                    $switch: {
                      branches: [
                        { case: { $eq: ["$$this", "가슴"] }, then: "가슴" },
                        { case: { $eq: ["$$this", "승모"] }, then: "등" },
                        { case: { $eq: ["$$this", "어깨"] }, then: "어깨" },
                        {
                          case: { $in: ["$$this", ["종아리", "대퇴사두"]] },
                          then: "하체",
                        },
                        {
                          case: { $in: ["$$this", ["이두", "삼두", "전완"]] },
                          then: "팔",
                        },
                        { case: { $eq: ["$$this", "복근"] }, then: "코어" },
                      ],
                      default: "기타",
                    },
                  },
                },
                // 이미 배열에 있는 카테고리라면 추가하지 않음 ($in)
                in: {
                  $cond: {
                    if: { $in: ["$$mappedCategory", "$$value"] },
                    then: "$$value",
                    else: { $concatArrays: ["$$value", ["$$mappedCategory"]] },
                  },
                },
              },
            },
          },
        },
      },
    },
    { $sort: { date: -1 } },
  ]);

  return rawHistory;
};

module.exports = {
  createExerciseHistory,
  getWorkoutSession,
  saveWorkoutSession,
  getMonthlyHistory,
};
