import "./DateCircle.css";

const DateCircle = ({ data }) => {
  const { date, isToday, isWorkout } = data;

  const circleColor = isToday
    ? "#4A508E" // 오늘
    : isWorkout
    ? "#4caf50" // 운동함
    : "transparent"; // 비활성화

  let classNames = "week-info__date-circle";
  if (isToday) classNames += " week-info__date-circle--today";
  if (isWorkout) classNames += " week-info__date-circle--workout";

  return (
    <div
      className={classNames}
      style={{
        backgroundColor: circleColor,
        border: isToday ? "2px solid #999" : "none",
      }}
    >
      {date}
    </div>
  );
};

export default DateCircle;