import styles from "./ExerciseRecordSection.module.css";
import ExerciseCard from "../../common/ExerciseCard";

const formatDuration = (seconds) => {
  if (typeof seconds !== "number" || seconds < 0) return "0.0";
  return (seconds / 60).toFixed(1);
};

const ExerciseRecordSection = ({ myStats, recentLogs }) => {
  const statsData = [
    { value: myStats.best.weight, unit: "kg", label: "최고 무게" },
    { value: myStats.total.reps, unit: "회", label: "총 횟수" },
    { value: myStats.best.volume, unit: "kg", label: "최고 볼륨" },
    { value: formatDuration(myStats.total.time), unit: "분", label: "총 시간" },
  ];

  return (
    <div className={styles.container}>
      <section>
        <h4>최고 기록</h4>
        <div className={styles.statsList}>
          {statsData.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <div className={styles.value}>
                {stat.value || "-"}
                <span className={styles.unit}>{stat.unit}</span>
              </div>
              <p className={styles.label}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4>최근 기록</h4>
        <div className={styles.recentLogs}>
          {recentLogs.map((log, index) => (
            <ExerciseCard
              key={log.id || index}
              record={log}
              isMenuSelector={false}
              isDetailSelector={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExerciseRecordSection;
