// utils/responseMap.js

// 루틴/챌린지의 진행도를 계산하여 프론트엔드 형식에 맞게 반환
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

// 목표 리스트 아이템 변환
const mapGoalToListItem = (goal) => {
  const typeMap = {
    ROUTINE: "루틴",
    CHALLENGE: "챌린지",
  };
  // 진행도 계산 유틸리티 사용
  const progress = calculateGoalProgress(goal);
  return {
    id: goal._id,
    name: goal.name,
    goalType: typeMap[goal.goalType] || goal.goalType,
    activeDays: mapActiveDaysToDisplay(goal.activeDays),
    creator: goal.creator?.nickname || "Unknown",
    status: goal.status,
    parts: goal.parts || [],
    downloadCount: goal.downloadCount,
    isPublic: goal.isUserPublic,
    progress: progress,
  };
};

// 목표 상세 정보 변환
const mapGoalToDetail = (userGoal) => {
  const originalGoal = userGoal.goalId || {};
  const creator = originalGoal.creatorId || {};

  const progress = calculateGoalProgress({
    goalType: originalGoal.goalType,
    durationWeek: userGoal.durationWeek,
    activeDays: userGoal.activeDays,
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
        days: ex.days,
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
      title: item.title || "개인 운동",
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
  mapGoalToListItem,
  mapGoalToDetail,
  mapHistoryToCalendar,
  calculateGoalProgress,
};
