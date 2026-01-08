import { memo, useEffect } from "react";
import styles from "./TodayGoal.module.css";
import { useGoals } from "../../../hooks/useGoals";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";
import TodayGoalSlider from "./TodayGoalSlider";

const TodayGoal = () => {
  const { todayGoals, todayLoading, todayError, loadTodayGoals } = useGoals();

  useEffect(() => {
    loadTodayGoals();
  }, [loadTodayGoals]);

  if (todayLoading) {
    return (
      <div className={styles.section}>
        <Spinner text="오늘의 목표 확인 중..." />
      </div>
    );
  }

  if (todayError) {
    return (
      <div className={styles.section}>
        <ErrorMessage
          message="목표를 불러오지 못했습니다."
          onRetry={loadTodayGoals}
        />
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <h4>오늘 목표</h4>
      <div className={styles.container}>
        <TodayGoalSlider goals={todayGoals ?? []} />
      </div>
    </section>
  );
};

export default memo(TodayGoal);
