import { getDay } from "date-fns";
import styles from "./Calendar.module.css";

const CalendarDay = ({
  date,
  dayOfMonth,
  isCurrentMonth,
  isToday,
  isSelected,
  isDisabled,
  opacity,
  onClick,
  children,
}) => {
  if (!isCurrentMonth) {
    return <div className="calendar-day-cell is-not-current-month" />;
  }

  // 주말 색상 처리
  const dayIndex = getDay(date);
  const isSunday = dayIndex === 0;
  const isSaturday = dayIndex === 6;
  const weekendClass = isSunday ? "is-sunday" : isSaturday ? "is-saturday" : "";

  // 오늘/선택/비활성화 클래스
  const todayClass = isToday ? "is-today" : "";
  const selectedClass = isSelected ? "is-selected" : "";
  const disabledClass = isDisabled ? "is-disabled" : "";

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`${styles.calendarDayCell} ${weekendClass} ${selectedClass} ${disabledClass}`}
      onClick={handleClick}
      style={{
        opacity: opacity,
        cursor: isDisabled ? "default" : "pointer",
      }}
      title={isDisabled ? "선택할 수 없는 날짜" : ""}
    >
      <div className={`${styles.dayNumber} ${todayClass}`}>{dayOfMonth}</div>
      <div className={styles.dayContentArea}>{children}</div>
      {isSelected && <div className={styles.selectedDot} />}
    </div>
  );
};

export default CalendarDay;
