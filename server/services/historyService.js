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

  const koreanRecordType = mapRecordTypeToKorean(type);

  const updateDoc = {
    $inc: { totalExerciseCount: 1 },

    $push: {
      records: {
        date: new Date(date),
        relatedUserGoalId: userGoalId || null,
        goalName: title,
        recordType: koreanRecordType,
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
  // 기록 저장 전 유저의 목표 상태 갱신
  await goalService.refreshUserGoalsStatus(userId);

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
    if (shouldIncrementSession) {
      // 하루 운동 제한
      goal = await UserGoal.findByIdAndUpdate(
        userGoalId,
        { $inc: { completedSessions: 1 } },
        { new: true } // 업데이트된 문서를 반환받기 위해
      );
    } else {
      goal = await UserGoal.findById(userGoalId);
    }

    // 목표 완료 처리
    if (goal && goal.goalType === "CHALLENGE") {
      if (
        goal.completedSessions >=
        goal.activeDays.length * goal.durationWeek
      ) {
        await UserGoal.findByIdAndUpdate(userGoalId, { status: "완료" });
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
    // 이 세션이 하루의 첫 세션이었는지 다시 확인해야 합니다. (복잡하지만 가장 안전함)
    // 여기서는 간소화를 위해, 해당 기록이 속했던 날짜에 UserGoalID로 기록된 다른 레코드가 없으면
    // completedSessions를 감소시킨다고 가정합니다.
    // **주의:** 현재 로직은 '오늘' 처음 완료했을 때만 카운트를 증가시켰으므로,
    // 해당 세션을 삭제했을 때, 그날의 다른 세션이 남아있는지 확인해야 합니다.
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
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$records.date" },
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
  getWorkoutRecordById,
  getMonthlyHistory,
  deleteWorkoutRecord,
  updateWorkoutRecord,
};
