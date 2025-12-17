import { memo } from "react";
import styles from "./WeekInfo.module.css";
import MuscleMap from "../../common/MuscleMap";
import DateCircle from "./DateCircle";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";
import { useFetchWeekly } from "../../../hooks/useStats";

const WeekInfo = () => {
  const { data, loading, error, refetch } = useFetchWeekly();

  if (loading) return <Spinner text="주간 기록 불러오는 중..." />;
  if (error)
    return (
      <ErrorMessage message="기록을 불러오지 못했습니다." onRetry={refetch} />
    );
  if (!data) return null;

  const {
    currentWeek,
    weeklyTargetMuscles,
    todayMinutes,
    weeklyAverageMinutes,
  } = data;

  return (
    <section className={styles.container}>
      <h4 className="section-title">이번주</h4>

      <div className={styles.contentWrapper}>
        <aside className={styles.muscleMapWrapper}>
          <MuscleMap selectedTags={weeklyTargetMuscles} />
        </aside>

        <div className={styles.infoSection}>
          <div className={styles.calendarArea}>
            <div className={styles.dayHeader}>
              {currentWeek.map((day, idx) => (
                <div key={`day-${idx}`} className={styles.dayItem}>
                  {day.day}
                </div>
              ))}
            </div>

            <div className={styles.dateContainer}>
              {currentWeek.map((dayData, idx) => (
                <DateCircle key={`date-${idx}`} data={dayData} />
              ))}
            </div>
          </div>

          <div className={styles.summaryWrapper}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>오늘(분)</span>
              <strong className={styles.summaryValue}>{todayMinutes}</strong>
            </div>

            <div className={styles.verticalLine} aria-hidden="true" />

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>주간 평균</span>
              <strong className={styles.summaryValue}>
                {weeklyAverageMinutes}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(WeekInfo);
