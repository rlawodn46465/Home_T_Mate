// pages/Goal/WorkoutActivePage.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setTimerMode,
  updateCurrentSet,
  moveToNextStep,
  stopWorkoutSession,
} from "../../store/slices/workoutSlice";
import { useCreateHistory } from "../../hooks/useHistory";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import styles from "./WorkoutActivePage.module.css";
import type { SaveWorkoutRequest } from "../../types/history";

const WorkoutActivePage = () => {
  const dispatch = useAppDispatch();
  const { navigateToPanel, currentPath } = usePersistentPanel();
  const { createHistory, isSaving } = useCreateHistory();

  const workout = useAppSelector((state) => state.workout);
  const {
    todayExercises,
    currentExerciseIndex,
    currentSetIndex,
    workoutResults,
    timerMode,
    goalInfo,
    startTime,
  } = workout;

  // 타이머 상태 (단위: 초)
  const [seconds, setSeconds] = useState(0);

  // 현재 데이터 바인딩
  const currentExercise = todayExercises[currentExerciseIndex];
  const currentSetData =
    workoutResults[currentExerciseIndex]?.sets[currentSetIndex];
  const isLastSet = currentSetIndex === currentExercise?.sets.length - 1;
  const isLastExercise = currentExerciseIndex === todayExercises.length - 1;

  const exerciseDisplayName = currentExercise.name || "알 수 없는 운동";

  // 타이머 로직: WORK 또는 REST 모드일 때만 카운트업
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerMode === "WORK" || timerMode === "REST") {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerMode]);

  // 버튼 액션
  const handleStartSet = () => {
    setSeconds(0);
    dispatch(setTimerMode("WORK"));
  };

  const handleEndSet = () => {
    setSeconds(0);
    dispatch(setTimerMode("REST"));
  };

  const handleFinishWorkout = async () => {
    if (!goalInfo || !startTime) return;
    if (!window.confirm("모든 운동을 마치고 기록을 저장할까요?")) return;

    // 한국 시간 기준으로
    const now = new Date();
    const kstDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    // 총 소요 시간 계산
    const totalTime = Math.floor(
      (new Date().getTime() - new Date(startTime).getTime()) / 1000
    );

    const payload: SaveWorkoutRequest = {
      date: new Date().toISOString(),
      userGoalId: goalInfo.id,
      title: goalInfo.title,
      type: goalInfo.type,
      totalTime,
      exercises: workoutResults.map((ex) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map((s) => ({
          ...s,
          isCompleted: true,
        })),
        maxWeight: Math.max(...ex.sets.map((s) => s.weight)),
        totalVolume: ex.sets.reduce((acc, s) => acc + s.weight * s.reps, 0),
        totalReps: ex.sets.reduce((acc, s) => acc + s.reps, 0),
      })),
    };

    const success = await createHistory(payload);
    if (success) {
      alert("오늘 운동 완료! 고생하셨습니다.");
      dispatch(stopWorkoutSession());
      navigateToPanel("?panel=dashboard", currentPath);
    }
  };

  if (!currentExercise || !currentSetData)
    return <div>운동 데이터가 없습니다.</div>;

  return (
    <div className={styles.container}>
      {/* 상단: 현재 운동 정보 */}
      <header className={styles.header}>
        <h2>{exerciseDisplayName}</h2>
        <span className={styles.progress}>
          운동 {currentExerciseIndex + 1}/{todayExercises.length}
        </span>
      </header>

      {/* 중앙: 타이머 & 상태 */}
      <div
        className={`
  ${styles.timerSection} 
  ${timerMode === "WORK" ? styles.workMode : ""}
  ${timerMode === "REST" ? styles.restMode : ""}
  ${
    timerMode === "REST" && seconds >= (currentExercise.restTime || 0)
      ? styles.overtime
      : ""
  }
`}
      >
        <p className={styles.statusLabel}>
          {timerMode === "READY"
            ? "준비 완료"
            : timerMode === "WORK"
            ? "🔥 운동 중"
            : "🥤 휴식 중"}
        </p>
        <h1 className={styles.timerCount}>{seconds}s</h1>
      </div>

      {/* 무게 및 횟수 조절 */}
      <div className={styles.controlBox}>
        <div className={styles.setInfo}>현재 {currentSetIndex + 1}세트</div>

        <div className={styles.adjustRow}>
          <button
            onClick={() =>
              dispatch(updateCurrentSet({ weight: currentSetData.weight - 1 }))
            }
          >
            -
          </button>
          <div className={styles.valueDisplay}>
            <strong>{currentSetData.weight}</strong> kg
          </div>
          <button
            onClick={() =>
              dispatch(updateCurrentSet({ weight: currentSetData.weight + 1 }))
            }
          >
            +
          </button>
        </div>

        <div className={styles.adjustRow}>
          <button
            onClick={() =>
              dispatch(updateCurrentSet({ reps: currentSetData.reps - 1 }))
            }
          >
            -
          </button>
          <div className={styles.valueDisplay}>
            <strong>{currentSetData.reps}</strong> 회
          </div>
          <button
            onClick={() =>
              dispatch(updateCurrentSet({ reps: currentSetData.reps + 1 }))
            }
          >
            +
          </button>
        </div>
      </div>

      {/* 하단 버튼 제어 */}
      <footer className={styles.footer}>
        {timerMode === "READY" && (
          <button className={styles.startBtn} onClick={handleStartSet}>
            세트 시작
          </button>
        )}

        {timerMode === "WORK" && (
          <button className={styles.nextBtn} onClick={handleEndSet}>
            {isLastSet && isLastExercise
              ? "전체 운동 완료"
              : "세트 종료 (휴식)"}
          </button>
        )}

        {timerMode === "REST" && (
          <>
            {isLastSet && isLastExercise ? (
              <button
                className={styles.saveBtn}
                onClick={handleFinishWorkout}
                disabled={isSaving}
              >
                {isSaving ? "저장 중..." : "최종 완료 및 저장"}
              </button>
            ) : (
              <button
                className={styles.startBtn}
                onClick={() => dispatch(moveToNextStep())}
              >
                휴식 끝 / 다음 세트
              </button>
            )}
          </>
        )}
      </footer>
    </div>
  );
};

export default WorkoutActivePage;
