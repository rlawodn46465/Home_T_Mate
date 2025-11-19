import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDate,
} from "date-fns";
import { ko } from "date-fns/locale";
import CalendarDay from "./CalendarDay";
import { useMemo, useState } from "react";

import "./Calendar.css";

// 서버에서 받아온다고 가정한 더미 운동 데이터 (YYYY-MM-DD 형식)
// 예시: 9월 3일: 가슴, 등, 어깨 / 9월 10일: 하체, 코어 / 9월 8일: 가슴
const DUMMY_WORKOUT_DATA = {
  "2025-09-03": ["가슴", "등", "어깨", "하체", "팔", "코어"],
  "2025-09-04": ["가슴", "등", "어깨", "하체", "팔", "코어"],
  "2025-09-10": ["하체", "코어"],
  "2025-09-08": ["가슴"],
  "2025-08-31": ["팔"], // 이전 달 데이터 예시
  "2025-10-04": ["코어"], // 다음 달 데이터 예시
  "2025-11-19": ["코어"], // 다음 달 데이터 예시
};

const Calendar = () => {
  // 오늘 날짜
  const today = useMemo(() => new Date(), []);

  // 오늘 날짜로 초기 설정
  const [currentDate, setCurrentDate] = useState(today);

  // 월 이동 핸들러
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // 달력 날짜 배열 생성
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { locale: ko });
  const endDate = endOfWeek(monthEnd, { locale: ko });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 헤더 요일 배열
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 날짜에 해당하는 운동 데이터 조회
  const getWorkoutsForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return DUMMY_WORKOUT_DATA[dateKey] || null;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-body">
        {/* 월/연도 네비 */}
        <div className="calendar-nav">
          <button onClick={prevMonth} className="nav-arrow">
            {"<"}
          </button>
          <p className="nav-month-year">
            {format(currentDate, "yyyy년 M월", { locale: ko })}
          </p>
          <button onClick={nextMonth} className="nav-arrow">
            {">"}
          </button>
        </div>
        {/* 요일 */}
        <div className="calendar-grid calendar-weekdays">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`weekday-header ${index === 0 ? "is-sunday" : ""} ${
                index === 6 ? "is-saturday" : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        {/* 날짜 그리드 */}
        <div className="calendar-grid calendar-days">
          {calendarDays.map((date, index) => {
            const workouts = getWorkoutsForDate(date);

            return (
              <CalendarDay
                key={index}
                date={date}
                dayOfMonth={getDate(date)}
                isCurrentMonth={isSameMonth(date, currentDate)}
                hasWorkout={!!workouts}
                workouts={workouts || []}
                isToday={isSameDay(date, today)}
              />
            );
          })}
        </div>
        {/* 운동 부위 */}
        <div className="calendar-legend">
          <span className="legend-item">
            <span
              className="workout-dot"
              style={{ backgroundColor: "#DC3545" }}
            />
            가슴
          </span>
          <span className="legend-item">
            <span
              className="workout-dot"
              style={{ backgroundColor: "#FFC107" }}
            />
            등
          </span>
          <span className="legend-item">
            <span
              className="workout-dot"
              style={{ backgroundColor: "#28A745" }}
            />
            어깨
          </span>
          <span className="legend-item">
            <span
              className="workout-dot"
              style={{ backgroundColor: "#007BFF" }}
            />
            하체
          </span>
          <span className="legend-item">
            <span
              className="workout-dot"
              style={{ backgroundColor: "#17A2B8" }}
            />
            팔
          </span>
          <span className="legend-item">
            <span
              className="workout-dot"
              style={{ backgroundColor: "#6610F2" }}
            />
            코어
          </span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
