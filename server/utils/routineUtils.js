// utils/routineUtils.js

// 루틴/챌린지의 진행도를 계산하여 프론트엔드 형식에 맞게 반환
const calculateProgress = (routine) => {
  // 챌린지 (Challenge) 진행도 계산: 백분율 (%)
  if (routine.routineType === "Challenge") {
    const targetWeeks = routine.goalWeeks || 1;

    // 총 목표 운동 횟수 계산
    // 주당 목표 세션 수
    const weeklyTargetSessions = routine.exercises.reduce((acc, exercise) => {
      return acc + exercise.days.length;
    }, 0);

    // 총 목표 횟수 = (주당 목표 세션 합계) * 목표 주차 수
    const totalTargetSessions = weeklyTargetSessions * targetWeeks;

    if (totalTargetSessions === 0) {
      return { type: "Percent", value: 0, targetWeek: targetWeeks };
    }

    // (실제 완료 횟수 / 총 목표 횟수) * 100
    const progressValue = Math.min(
      100,
      (routine.completedSessions / totalTargetSessions) * 100
    );

    return {
      type: "Percent",
      value: parseFloat(progressValue.toFixed(1)), // 소수점 첫째 자리까지
      targetWeek: targetWeeks,
    };

    // 루틴 (Routine) 진행도 계산: 주차
  } else {
    // 루틴은 '현재 주차' 값을 그대로 사용
    const currentWeek = routine.currentWeek || 1;
    return {
      type: "Week",
      value: currentWeek,
    };
  }
};

// 요일 변환 헬퍼 함수
const mapActiveDaysToDisplay = (days) => {
  const count = days.length;
  const sortedDays = [...days].sort();

  // 모든 요일
  const allDays = ["일", "월", "화", "수", "목", "금", "토"].sort();
  const daysStr = sortedDays.join(",");

  if (count === 7 && daysStr === allDays.join(",")) {
    return "매일";
  }

  // '주말' 조건
  const weekend = ["일", "토"];
  if (daysStr === weekend.sort().join(",")) {
    return "주말";
  }

  // '평일' 조건
  const weekdaysSorted = ["월", "화", "수", "목", "금"].sort();
  if (count === 5 && sortedDays.join(",") === weekdaysSorted.join(",")) {
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

// 모델 객체를 목록에 필요한 간소화된 JSON 형태 변환
const mapRoutineToListItem = (routine) => {
  const typeMap = {
    Routine: "루틴",
    Challenge: "챌린지",
  };

  // 진행도 계산 유틸리티 사용
  const progress = calculateProgress(routine);

  // 운동 부위 목록 추출 (중복 제거)
  const allParts = routine.parts || [];

  return {
    id: routine._id,
    name: routine.name,
    routineType: typeMap[routine.routineType] || routine.routineType,
    activeDays: mapActiveDaysToDisplay(routine.activeDays),
    creator: routine.creator
      ? {
          id: routine.creator._id,
          nickname: routine.creator.nickname || "Unknown User",
        }
      : null,
    status: routine.status,
    category: routine.category,
    parts: allParts,
    progress: progress,
  };
};

// Mongoose 모델 객체를 상세 조회에 필요한 JSON 형태로 변환
const mapRoutineToDetail = (routine) => {
  const progress = calculateProgress(routine);

  // 루틴 전체의 운동 요일 추출 (중복 제거)
  const allDays = Array.from(
    new Set(routine.exercises.flatMap((ex) => ex.days))
  );

  return {
    id: routine._id,
    name: routine.name,
    routineType: routine.routineType,
    creator: routine.creator
      ? {
          id: routine.creator._id,
          nickname: routine.creator.nickname || "Unknown User",
        }
      : null,
    createdAt: routine.createdAt,
    status: routine.status,
    progress: progress,
    goalWeeks: routine.goalWeeks,
    days: allDays,
    parts: routine.parts || [],
    exercises: routine.exercises.map((ex) => ({
      name: ex.name,
      targetMuscles: ex.targetMuscles,
      days: ex.days,
      restTime: ex.restTime,
      sets: ex.sets,
    })),
  };
};

module.exports = {
  calculateProgress,
  mapRoutineToListItem,
  mapRoutineToDetail,
};
