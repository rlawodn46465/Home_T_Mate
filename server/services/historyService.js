// services/historyService.js

const mongoose = require("mongoose");
const ExerciseHistory = require("../models/ExerciseHistory");
const UserGoal = require("../models/UserGoal");
const goalService = require("./goalService");
const {
  checkDailySessionCompleted,
  mapRecordToSingleRecordResponse,
} = require("../utils/responseMap");
const { mapRecordTypeToKorean } = require("../utils/constants");

// 운동 기록 추가
const createExerciseHistory = async (userId, exerciseLog, workoutMeta) => {
  const { date, userGoalId, type, title, totalTime } = workoutMeta;

  const mappedSets = exerciseLog.sets.map((set) => ({
    setNumber: set.setNumber,
    weight: set.weight,
    reps: set.reps,
    isCompleted: true, 
  }));

  const koreanRecordType = mapRecordTypeToKorean(type);

  const updateDoc = {
    $inc: { totalExerciseCount: 1 },
    $set: {
      personalBestWeight: Math.max(0, ...exerciseLog.sets.map((s) => s.weight)),
    },
    $push: {
      records: {
        date: new Date(date),
        relatedUserGoalId: userGoalId || null,
        goalName: title,
        recordType: koreanRecordType,
        totalTime: totalTime,
        sets: mappedSets,
        maxWeight: exerciseLog.maxWeight,
        totalVolume: exerciseLog.totalVolume,
        totalReps: exerciseLog.totalReps,
      },
    },
  };

  await ExerciseHistory.findOneAndUpdate(
    { userId, exerciseId: exerciseLog.exerciseId },
    updateDoc,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// 운동 기록 저장 (운동 완료 시 호출)
const saveWorkoutSession = async (userId, workoutData) => {
  // 기록 저장 전 유저의 목표 상태 갱신
  await goalService.refreshUserGoalsStatus(userId);
  const { date, userGoalId, exercises, totalTime, title, type } = workoutData;

  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    throw new Error("저장할 운동 기록이 누락되었습니다.");
  }

  // 각 운동별 히스토리 생성
  const workoutInfo = { date, userGoalId, title, type, totalTime };
  await Promise.all(
    exercises.map((ex) => createExerciseHistory(userId, ex, workoutInfo))
  );

  // UserGoal 진행도 업데이트
  if (userGoalId && (type === "ROUTINE" || type === "CHALLENGE")) {
    const goal = await UserGoal.findById(userGoalId);
    if (goal) {
      await UserGoal.findByIdAndUpdate(userGoalId, {
        $inc: { completedSessions: 1 },
      });

      // 챌린지 성공 조건 체크
      if (goal.status === "진행중" && goal.durationWeek) {
        const totalNeeded = goal.activeDays.length * goal.durationWeek;
        if (goal.completedSessions + 1 >= totalNeeded) {
          await UserGoal.findByIdAndUpdate(userGoalId, { status: "완료" });
        }
      }
    }
  }
};

// 단일 운동 기록 조회
const getWorkoutRecordById = async (userId, recordId) => {
  // ObjectId로 변환
  const objectId = new mongoose.Types.ObjectId(recordId);

  const historyDoc = await ExerciseHistory.findOne(
    {
      userId: userId,
      "records._id": objectId,
    },
    {
      userId: 1,
      exerciseId: 1,
      records: {
        $elemMatch: { _id: objectId },
      },
    }
  )
    .populate("exerciseId", "name category targetMuscles")
    .populate({
      path: "records.relatedUserGoalId",
      select: "name goalType startDate activeDays durationWeek customExercises",
    });

  if (!historyDoc || !historyDoc.records || historyDoc.records.length === 0) {
    return null;
  }

  const singleRecord = historyDoc.records[0];

  const mappedRecord = mapRecordToSingleRecordResponse(
    singleRecord,
    historyDoc.exerciseId
  );

  return mappedRecord;
};

// 운동 기록 삭제
const deleteWorkoutRecord = async (userId, recordId) => {
  const historyDoc = await ExerciseHistory.findOne({
    userId: userId,
    "records._id": new mongoose.Types.ObjectId(recordId),
  });

  if (!historyDoc) {
    throw new Error("삭제할 기록을 찾을 수 없거나 소유권이 없습니다.", 404);
  }

  const recordToDelete = historyDoc.records.find(
    (r) => r._id.toString() === recordId
  );

  if (!recordToDelete) {
    throw new Error("삭제할 기록을 찾을 수 없습니다.", 404);
  }

  const sessionGoalId = recordToDelete.relatedUserGoalId;
  const sessionDate = recordToDelete.date.toISOString(); // 3. records 배열에서 해당 요소를 삭제합니다.

  await ExerciseHistory.updateOne(
    { _id: historyDoc._id },
    { $pull: { records: { _id: recordId } } }
  );

  if (sessionGoalId) {
    const dayHasOtherSessions = await checkDailySessionCompleted(
      userId,
      sessionGoalId,
      sessionDate
    );

    if (!dayHasOtherSessions) {
      await UserGoal.findByIdAndUpdate(sessionGoalId, {
        $inc: { completedSessions: -1 },
      });
    }
  }
  const updatedDoc = await ExerciseHistory.findOne({ _id: historyDoc._id });
  if (updatedDoc && updatedDoc.records.length === 0) {
    await ExerciseHistory.deleteOne({ _id: historyDoc._id });
  }
};

// 운동 기록 수정 (PUT)
const updateWorkoutRecord = async (userId, recordId, updatedData) => {
  let exerciseData = updatedData.exercises
    ? updatedData.exercises[0]
    : updatedData;

  exerciseData = {
    ...exerciseData,
    date: updatedData.date,
    totalTime: updatedData.totalTime,
  };

  const allowedUpdates = [
    "duration",
    "totalVolume",
    "maxWeight",
    "totalReps",
    "sets",
    "totalTime",
    "date",
  ];

  const updatePayload = {};

  if (exerciseData) {
    Object.keys(exerciseData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updatePayload[key] = exerciseData[key];
      }
    });
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new Error(
      "유효한 운동 기록 수정 데이터가 포함되어 있지 않습니다.",
      400
    );
  }

  const setUpdates = {};
  Object.keys(updatePayload).forEach((key) => {
    setUpdates[`records.$.${key}`] = updatePayload[key];
  });

  const result = await ExerciseHistory.findOneAndUpdate(
    {
      userId: userId,
      "records._id": new mongoose.Types.ObjectId(recordId),
    },
    {
      $set: setUpdates,
    },
    { new: true }
  );

  if (!result) {
    throw new Error("수정할 기록을 찾을 수 없거나 소유권이 없습니다.", 404);
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

    {
      $lookup: {
        from: "exercises",
        localField: "exerciseId",
        foreignField: "_id",
        as: "exerciseInfo",
      },
    },
    { $unwind: "$exerciseInfo" },

    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$records.date",
              timezone: "Asia/Seoul",
            },
          },
          type: "$records.recordType",
          goalId: "$records.relatedUserGoalId",
        },
        title: { $first: "$records.goalName" },
        recordType: { $first: "$records.recordType" },
        totalSessionTime: { $max: "$records.totalTime" },

        rawMusclesArray: { $addToSet: "$exerciseInfo.targetMuscles" },

        exercises: {
          $push: {
            id: "$records._id",
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
        _id: 0, 
        date: "$_id.date", 
        recordType: "$recordType", 
        goalId: "$_id.goalId",
        title: "$title",
        totalSessionTime: "$totalSessionTime", 
        exercises: "$exercises", 

        categoryGroup: {
          $reduce: {
            input: {
              $reduce: {
                input: "$rawMusclesArray",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
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
  getWorkoutRecordById,
  getMonthlyHistory,
  deleteWorkoutRecord,
  updateWorkoutRecord,
};
