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
  startOfDay,
  getDay,
  isAfter,
  isBefore,
} from "date-fns";
import { ko } from "date-fns/locale";
import CalendarDay from "./CalendarDay";
import { useMemo, useState } from "react";

import "./Calendar.css";

const Calendar = ({
  startDate,
  endDate,
  activeDays = [],
  selectedDate,
  onSelectDate,
  renderDayContents,
}) => {
  // 오늘 날짜
  const today = useMemo(() => startOfDay(new Date()), []);
  // 오늘 날짜로 초기 설정
  const [currentDate, setCurrentDate] = useState(new Date());

  // 월 이동 핸들러
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // 달력 날짜 배열 생성
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ko });
  const calendarEnd = endOfWeek(monthEnd, { locale: ko });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // 헤더 요일 배열
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const getDateStatus = (date) => {
    const checkDate = startOfDay(date);
    const startLimit = startDate ? startOfDay(new Date(startDate)) : null;
    const endLimit = endDate ? startOfDay(new Date(endDate)) : null;

    // 범위 체크
    const isTooEarly = startLimit ? isBefore(checkDate, startLimit) : false;
    const isFuture = isAfter(checkDate, today);
    const isAfterEnd = endLimit ? isAfter(checkDate, endLimit) : false;

    if (isTooEarly || isFuture || isAfterEnd) {
      return { disabled: true, opacity: 0.2 };
    }

    // 요일 체크
    const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
    const dayStr = dayMap[getDay(checkDate)];
    const isActiveDay = activeDays.length === 0 || activeDays.includes(dayStr);

    if (!isActiveDay) {
      return { disabled: true, opacity: 0.5 };
    }

    return { disabled: false, opacity: 1 };
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
            const { disabled, opacity } = getDateStatus(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);

            return (
              <CalendarDay
                key={index}
                date={date}
                dayOfMonth={getDate(date)}
                isCurrentMonth={isSameMonth(date, currentDate)}
                isToday={isSameDay(date, today)}
                isSelected={isSelected}
                isDisabled={disabled}
                opacity={opacity}
                onClick={() => !disabled && onSelectDate(date)}
              >
                {isSameMonth(date, currentDate) &&
                  renderDayContents &&
                  renderDayContents(date)}
              </CalendarDay>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
