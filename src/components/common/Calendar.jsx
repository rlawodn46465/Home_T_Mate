import { useState, useMemo } from "react";
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
  isBefore,
  isAfter,
  startOfDay,
  getDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import CalendarDay from "./CalendarDay";
import "./Calendar.css";

const Calendar = ({
  startDate, // 목표 시작일 (이전 날짜 선택 불가)
  endDate, // 챌린지 종료일 (없으면 null)
  activeDays = [], // 활성화된 요일 ["월", "수", "금"]
  selectedDate, // 현재 선택된 날짜
  onSelectDate, // 날짜 선택 핸들러
  recordedDates = [], // (선택 사항) 이미 기록된 날짜에 점을 찍고 싶다면 사용
}) => {
  // 오늘 날짜 (시간 제외하고 날짜만 비교하기 위함)
  const today = useMemo(() => startOfDay(new Date()), []);

  // 달력 기준 날짜 (월 이동용)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 월 이동 핸들러
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // 달력 그리드 생성
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ko });
  const calendarEnd = endOfWeek(monthEnd, { locale: ko });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 🛠️ 날짜 유효성 및 상태 계산 함수
  const getDateStatus = (date) => {
    const checkDate = startOfDay(date);

    // 1. 범위 체크: 시작일 이전이거나, 오늘 이후거나, 종료일 이후면 아예 선택 불가
    const isTooEarly = isBefore(checkDate, startOfDay(new Date(startDate)));
    const isFuture = isAfter(checkDate, today);
    const isAfterEnd = endDate
      ? isAfter(checkDate, startOfDay(new Date(endDate)))
      : false;

    if (isTooEarly || isFuture || isAfterEnd) {
      return { disabled: true, opacity: 0.2 }; // 아예 비활성 (흐리게)
    }

    // 2. 요일 체크: 범위 안이지만, 지정된 요일이 아닌 경우
    const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
    const dayStr = dayMap[getDay(checkDate)];
    const isActiveDay = activeDays.includes(dayStr);

    if (!isActiveDay) {
      return { disabled: true, opacity: 0.5 }; // 비활성 (반투명)
    }

    // 3. 선택 가능
    return { disabled: false, opacity: 1 };
  };

  return (
    <div className="calendar-container">
      <div className="calendar-body">
        {/* 네비게이션 */}
        <div className="calendar-nav">
          <button onClick={prevMonth} className="nav-arrow">
            {"<"}
          </button>
          <p className="nav-month-year">
            {format(currentMonth, "yyyy년 M월", { locale: ko })}
          </p>
          <button onClick={nextMonth} className="nav-arrow">
            {">"}
          </button>
        </div>

        {/* 요일 헤더 */}
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
            // const hasRecord = recordedDates.includes(format(date, 'yyyy-MM-dd')); // 점 찍기용

            return (
              <CalendarDay
                key={index}
                date={date}
                dayOfMonth={getDate(date)}
                isCurrentMonth={isSameMonth(date, currentMonth)}
                isToday={isSameDay(date, today)}
                isSelected={isSelected}
                isDisabled={disabled}
                opacity={opacity}
                onClick={() => !disabled && onSelectDate(date)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
