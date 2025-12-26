import styles from "./WeekDaySelector.module.css";

type DayOfWeek = "월" | "화" | "수" | "목" | "금" | "토" | "일";

interface WeekDaySelectorProps {
  selectedDays: string[] | DayOfWeek[];
}

const WeekDaySelector = ({ selectedDays }: WeekDaySelectorProps) => {
  const daysOfWeek: DayOfWeek[] = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className={styles.weekdaySelector}>
      {daysOfWeek.map((day, index) => (
        <span
          key={index}
          className={selectedDays.includes(day) ? styles.activeDay : ""}
        >
          {day}
        </span>
      ))}
    </div>
  );
};

export default WeekDaySelector;
