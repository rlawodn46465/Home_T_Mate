// utils/responseMap.js

const { default: mongoose } = require("mongoose");
const ExerciseHistory = require("../models/ExerciseHistory");

// 루틴/챌린지의 진행도를 계산
const calculateGoalProgress = (goal) => {
  // 주당 운동 횟수
  const activeDaysCount = goal.activeDays ? goal.activeDays.length : 0;

  // 챌린지의 경우 전체 진행도 계산
  if (goal.goalType === "CHALLENGE") {
    // 목표주차(없으면 1을 기본값)
    const targetWeeks = goal.durationWeek || 1;

    // 총 목표 세션 수 (주당 횟수 * 목표 주차)
    const totalTargetSessions = activeDaysCount * targetWeeks;

    if (totalTargetSessions > 0) {
      // (완료 횟수 / 총 목표)
      let progress = goal.completedSessions / totalTargetSessions;

      // 1(100%)을 넘지 않도록 제한
      progress = Math.min(progress, 1);

      // 소수점 둘째자리까지만 남기기 (선택사항, 예: 0.33)
      return parseFloat(progress.toFixed(2));
    }
  }
  return goal.currentWeek;
};

// 요일 변환 헬퍼 함수
// 요일 확인 후 '매일', '주말', '평일', 'n요일', '주 n요일'로 변환
const mapActiveDaysToDisplay = (days) => {
  const count = days.length;
  const sortedDays = days;

  // 모든 요일
  const allDays = ["월", "화", "수", "목", "금", "토", "일"];
  const daysStr = sortedDays.join(",");

  if (count === 7 && daysStr === allDays.join(",")) {
    return "매일";
  }

  // '주말' 조건
  const weekend = ["토", "일"];
  if (daysStr === weekend.join(",")) {
    return "주말";
  }

  // '평일' 조건
  const weekdays = ["월", "화", "수", "목", "금"];
  if (count === 5 && sortedDays.join(",") === weekdays.join(",")) {
    return "평일";
  }

  // 요일 하나일 경우
  if (count === 1) {
    return `${days[0]}요일`;
  }

  // 그 외 (주 n일)
  if (count > 1) {
    return `주 ${count}`;
  }

  return "비활성";
};

// 요일 순서 정렬
const sortActiveDays = (days) => {
  if (!days || days.length === 0) return [];

  const dayOrder = ["월", "화", "수", "목", "금", "토", "일"];

  return days.slice().sort((a, b) => {
    return dayOrder.indexOf(a) - dayOrder.indexOf(b);
  });
};

// 단일 운동 기록 응답을 형식에 맞게 변환
const mapRecordToSingleRecordResponse = (singleRecord, exerciseMaster) => {
  if (!singleRecord) return null;

  const goal = singleRecord.relatedUserGoalId;

  const goalMeta = goal
    ? {
        userGoalId: goal._id.toString(),
        startDate: goal.startDate, // 챌린지 시작일
        activeDays: goal.activeDays || [], // 활동 요일
        durationWeek: goal.durationWeek || 0, // 챌린지 기간
      }
    : {
        userGoalId: null,
        startDate: null,
        activeDays: [],
        durationWeek: 0,
      };

  return {
    // 1. 기록 메타 정보
    recordId: singleRecord._id.toString(),
    date: singleRecord.date.toISOString(),
    type: singleRecord.recordType, // ROUTINE, CHALLENGE, PERSONAL
    title: singleRecord.goalName,
    totalTime: singleRecord.totalTime,

    // 2. 목표 메타 정보 병합
    ...goalMeta,

    // 3. 운동 상세 정보 (수정 페이지에서 필요한 형식)
    exercises: [
      {
        exerciseId: exerciseMaster._id.toString(),
        name: exerciseMaster.name,
        targetMuscles: exerciseMaster.targetMuscles,

        // 기록된 세트 데이터
        sets: singleRecord.sets || [],

        // 기록 당시 설정된 값 (없으면 0 또는 빈 값으로 대체)
        restTime: 0,
        days: goal
          ? goal.customExercises.find(
              (ce) => ce.exerciseId.toString() === exerciseMaster._id.toString()
            )?.days || []
          : [],
      },
    ],
  };
};

// 목표 리스트 변환
const formatUserGoalResponse = (ug) => {
  const goalInfo = ug.goalId;
  if (!goalInfo) return null;

  const typeMap = {
    ROUTINE: "루틴",
    CHALLENGE: "챌린지",
    PERSONAL: "개별운동",
  };

  // 진행도 계산
  const progressInput = {
    goalType: goalInfo.goalType,
    durationWeek: ug.durationWeek,
    activeDays: ug.activeDays,
    completedSessions: ug.completedSessions,
    currentWeek: ug.currentWeek,
  };
  const progress = calculateGoalProgress(progressInput);

  // 요일 순서 정렬
  const sortedActiveDays = sortActiveDays(ug.activeDays);

  // 요일 라벨 생성 (예: "주 3")
  const activeDaysLabel = mapActiveDaysToDisplay(sortedActiveDays);

  return {
    // 식별자 및 상태
    id: ug._id,
    userId: ug.userId,
    status: ug.status,
    startDate: ug.startDate,
    createdAt: ug.createdAt,

    // 진행도 및 목표 관련 데이터
    progress: progress,
    currentWeek: ug.currentWeek,
    completedSessions: ug.completedSessions,
    durationWeek: ug.durationWeek,

    // 요일 정보
    activeDays: sortedActiveDays,
    activeDaysLabel: activeDaysLabel,

    // 원본 목표 정보
    originalGoalId: goalInfo._id,
    name: goalInfo.name,
    goalType: goalInfo.goalType,
    goalTypeLabel: typeMap[goalInfo.goalType] || goalInfo.goalType,
    parts: goalInfo.parts,
    creator: goalInfo.creatorId?.nickname || "Unknown",

    // 커스텀 운동 목록
    customExercises: ug.customExercises.map((ce) => {
      const exerciseInfo = ce.exerciseId || {};
      return {
        exerciseId: exerciseInfo._id,
        name: exerciseInfo.name || "삭제된 운동",
        targetMuscles: exerciseInfo.targetMuscles || [],
        sets: ce.sets,
        days: sortActiveDays(ce.days),
        restTime: ce.restTime,
      };
    }),
  };
};

// userGoalId에 대해 오늘 운동 기록이 있는지 확인
const checkDailySessionCompleted = async (
  userId,
  userGoalId,
  dateString,
  recordIdToExclude = null
) => {
  // 날짜를 하루 단위 범위
  const today = new Date(dateString);
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const matchQuery = {
    relatedUserGoalId: userGoalId,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  };

  if (recordIdToExclude) {
    matchQuery._id = { $ne: new mongoose.Types.ObjectId(recordIdToExclude) };
  }

  const existingRecord = await ExerciseHistory.findOne(
    {
      userId: userId,
      records: {
        $elemMatch: {
          relatedUserGoalId: userGoalId,
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
    },
    { _id: 1 }
  );

  return !!existingRecord;
};

// 목표 상세 정보 변환
const mapGoalToDetail = (userGoal) => {
  const originalGoal = userGoal.goalId || {};
  const creator = originalGoal.creatorId || {};

  const progress = calculateGoalProgress({
    goalType: originalGoal.goalType,
    durationWeek: userGoal.durationWeek,
    activeDays: sortActiveDays(userGoal.activeDays),
    completedSessions: userGoal.completedSessions,
    currentWeek: userGoal.currentWeek,
  });

  return {
    id: userGoal._id,

    // 원본 목표
    name: originalGoal.name || "삭제된 루틴",
    goalType: originalGoal.goalType,
    parts: originalGoal.parts || [],

    // 제작자 정보
    creator: creator.nickname || "알 수 없음",
    creatorId: creator._id,

    // 사용자 진행 정보
    status: userGoal.status,
    startDate: userGoal.startDate,
    currentWeek: userGoal.currentWeek,
    durationWeek: userGoal.durationWeek,
    progress: progress,

    // 운동 목록
    exercises: userGoal.customExercises.map((ex) => {
      // populate된 운동 마스터 정보
      const exerciseInfo = ex.exerciseId || {};

      return {
        exerciseId: exerciseInfo._id,
        name: exerciseInfo.name || "이름 없음",
        targetMuscles: exerciseInfo.targetMuscles || [],

        // 사용자가 설정한 값
        days: sortActiveDays(ex.days),
        restTime: ex.restTime,
        sets: ex.sets.map((s) => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps,
        })),
      };
    }),

    createdAt: userGoal.createdAt,
  };
};

// 캘린더/히스토리 데이터 변환 (Aggregation 결과 처리)
const mapHistoryToCalendar = (aggregatedData) => {
  return aggregatedData.map((item) => {
    const exerciseCount = item.exercises.length;
    const firstExName = item.exercises[0]?.name || "운동";

    return {
      date: item._id.date,
      sessionType: item._id.type, // ROUTINE, CHALLENGE, PERSONAL
      title: item.title || "개별운동",
      totalTime: Math.round(item.totalTime / 60), // 분 단위 변환
      targetMuscles: item.targetMuscles.flat(),
      summaryText:
        exerciseCount > 1
          ? `${firstExName} 외 ${exerciseCount - 1}개`
          : firstExName,
      isSuccess: item.exercises.every((ex) => ex.isCompleted),
      exercises: item.exercises,
    };
  });
};

module.exports = {
  mapGoalToDetail,
  mapHistoryToCalendar,
  calculateGoalProgress,
  checkDailySessionCompleted,
  formatUserGoalResponse,
  mapRecordToSingleRecordResponse,
};
