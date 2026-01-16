// services/exerciseService.js

const Exercise = require("../models/Exercise");
const ExerciseHistory = require("../models/ExerciseHistory");
const { NotFoundError } = require("../utils/errorHandler");

// 필터 옵션에 따라 운동 마스터 목록 조회
const getExerciseList = async (filterOptions) => {
  const { search, part, tool } = filterOptions;
  const query = {};

  // 검색어 필터링 (search)
  if (search) query.name = { $regex: search, $options: "i" };
  // 운동 부위 필터링 (part)
  if (part) query.targetMuscles = part;
  // 운동 기구 필터링 (tool)
  if (tool) query.equipment = tool;

  // 이름 오름차순으로 정렬하여 반환
  const exercises = await Exercise.find(query).sort({ name: 1 });
  return exercises;
};

// 운동 상세 + 내 기록 반환
const getExerciseDetail = async (exerciseId, userId) => {
  const exercise = await Exercise.findById(exerciseId).lean();

  if (!exercise) throw new NotFoundError(`운동 정보가 없습니다.`);

  // 내 기록 조회
  const history = await ExerciseHistory.findOne({ userId, exerciseId }).lean();

  // 기록 없으면 기본값 반환
  if (!history) {
    return {
      exercise: exercise,
      myStats: {
        best: { weight: 0, volume: 0, reps: 0, time: 0 },
        total: { weight: 0, reps: 0, volume: 0, time: 0 },
        memo: "",
      },
      recentLogs: [],
    };
  }

  // 통계 데이터 계산
  let totalStats = {
    weight: 0, 
    reps: 0,
    volume: 0,
    time: 0,
  };

  let bestStats = {
    weight: history.personalBestWeight || 0,
    volume: 0,
    reps: 0,
    time: 0,
  };

  // 최근 기록 매핑
  const formattedLogs = [];

  // 기록 최신순으로 정렬
  const sortedRecords = history.records.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedRecords.forEach((record) => {
    // Total 통계 누적
    totalStats.volume += record.totalVolume || 0;
    totalStats.reps += record.totalReps || 0;
    totalStats.time += record.totalTime || 0;
    totalStats.weight += record.totalVolume || 0;

    // Best 통계 갱신
    if ((record.totalVolume || 0) > bestStats.volume)
      bestStats.volume = record.totalVolume;
    if ((record.totalTime || 0) > bestStats.time)
      bestStats.time = record.totalTime;

    // 최고 반복수(세션 총 횟수)
    if ((record.totalReps || 0) > bestStats.reps)
      bestStats.reps = record.totalReps;

    // 날짜 조정
    const formatDate = (date) => {
      if(!(date instanceof Date) || isNaN(date)) return null;

      return date.toISOString().split('T')[0];
    };

    // 프론트 구조에 맞게 수정
    formattedLogs.push({
      type: record.recordType ? record.recordType.toLowerCase() : "routine", // routine, challenge, single
      name: record.goalName || "자유 운동",
      date: formatDate(record.date),
      sets: record.sets.map((set) => ({
        set: set.setNumber,
        weight: set.weight,
        reps: set.reps,
      })),
      duration: record.totalTime,
    });
  });

  // 최종 데이터 조립
  return {
    exercise: exercise,
    myStats: {
      best: bestStats,
      total: totalStats,
      memo: history.personalMemo || "",
    },
    recentLogs: formattedLogs,
  };
};

module.exports = {
  getExerciseList,
  getExerciseDetail,
};
