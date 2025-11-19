import { getDay } from "date-fns";

const workoutTypes = {
  가슴: { color: "#DC3545", id: "chest" }, // 빨간색
  등: { color: "#FFC107", id: "back" }, // 주황색
  어깨: { color: "#28A745", id: "shoulder" }, // 초록색
  하체: { color: "#007BFF", id: "leg" }, // 파란색
  팔: { color: "#17A2B8", id: "arm" }, // 하늘색
  코어: { color: "#6610F2", id: "core" }, // 보라색
};

const CalendarDay = ({
  date,
  dayOfMonth,
  isCurrentMonth,
  hasWorkout,
  workouts,
  isToday,
}) => {
  if (!isCurrentMonth) {
    return <div className="calendar-day-cell is-not-current-month" />;
  }

  // 0: 일요일, 6: 토요일
  const isWeekend = getDay(date) === 0 || getDay(date) === 6;

  // 운동 유무에 따른 클래스 적용
  const workoutClass = hasWorkout ? "has-workout" : "no-workout";

  // 오늘 날짜 스타일
  const todayStyle = isToday ? "is-today" : "";

  // 운동 기록이 있는 날은 원으로 표시
  const dayDisplay = dayOfMonth;

  return (
    <div className={`calendar-day-cell ${isWeekend ? "is-weekend" : ""} ${workoutClass}`}>
      <div className={`day-number ${todayStyle}`}>{dayDisplay}</div>
      {hasWorkout && (
        <div className="workout-dots-container">
          {workouts.map((type, index) => {
            const workoutInfo = workoutTypes[type];
            if (workoutInfo) {
              return (
                <span
                  key={index}
                  className="workout-dot"
                  style={{ backgroundColor: workoutInfo.color }}
                  title={type}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
