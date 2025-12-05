import './WeekDaySelector.css'

const WeekDaySelector = ({ selectedDays }) => {
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="weekday-selector">
      {daysOfWeek.map((day, index) => (
        <span
          key={index}
          className={selectedDays.includes(day) ? "active-day" : ""}
        >
          {day}
        </span>
      ))}
    </div>
  );
};

export default WeekDaySelector;
