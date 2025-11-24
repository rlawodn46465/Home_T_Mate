import { getDay } from "date-fns";

const CalendarDay = ({
  date,
  dayOfMonth,
  isCurrentMonth,
  isToday,
  isSelected,
  isDisabled,
  opacity,
  onClick,
}) => {
  // 이번 달이 아닌 날짜는 렌더링은 하되 흐리게 처리하거나 빈 공간으로 둘 수 있음
  // 디자인 요구사항에 따라 빈칸 대신 흐리게 표시
  const monthClass = !isCurrentMonth ? "is-not-current-month" : "";

  // 주말 색상 처리
  const dayIndex = getDay(date);
  const isSunday = dayIndex === 0;
  const isSaturday = dayIndex === 6;
  const weekendClass = isSunday ? "is-sunday" : isSaturday ? "is-saturday" : "";

  // 오늘 날짜 스타일
  const todayClass = isToday ? "is-today" : "";

  // 선택된 날짜 스타일
  const selectedClass = isSelected ? "is-selected" : "";

  return (
    <div
      className={`calendar-day-cell ${monthClass} ${weekendClass} ${selectedClass}`}
      onClick={onClick}
      style={{
        opacity: opacity,
        cursor: isDisabled ? "default" : "pointer",
      }}
    >
      <div className={`day-number ${todayClass}`}>{dayOfMonth}</div>

      {/* 선택된 날짜 밑에 작은 점 표시 (선택됨을 강조) */}
      {isSelected && <div className="selected-dot" />}
    </div>
  );
};

export default CalendarDay;
