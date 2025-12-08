import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
  getDate,
  isBefore,
  isAfter,
  startOfDay,
  getDay,
  isValid,
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
  renderDayContents, // 점(Dot)을 그리기 위한 함수 prop
  currentMonth, // [수정] 부모에게서 받음
  onMonthChange, // [수정] 월 변경 핸들러
  isEditMode = false, // 기본값 false
  editDate = null, // 수정해야 할 고정 날짜
}) => {
  // 오늘 날짜 (시간 제외하고 날짜만 비교하기 위함)
  const today = useMemo(() => startOfDay(new Date()), []);

  // 달력 기준 날짜 (월 이동용)
  // const [currentMonth, setCurrentMonth] = useState(new Date());

  // 월 이동 핸들러
  const prevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

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

  // 유효한 날짜인지 확인
  const createValidDate = (dateProp) => {
    const dateObj = new Date(dateProp);
    // date-fns의 isValid()를 사용하여 유효성을 확인하고, 유효하지 않으면 null 반환
    return dateProp && isValid(dateObj) ? dateObj : null;
  };

  const validStartDate = useMemo(() => createValidDate(startDate), [startDate]);
  const validEndDate = useMemo(() => createValidDate(endDate), [endDate]);

  // 🛠️ 날짜 유효성 및 상태 계산 함수
  const getDateStatus = (date) => {
    const checkDate = startOfDay(date);

    // 수정 모드일 경우의 로직
    if (isEditMode && editDate) {
      // 수정 대상 날짜와 같은 날이면 활성화, 아니면 모두 비활성화
      if (isSameDay(checkDate, startOfDay(editDate))) {
        return { disabled: false, opacity: 1 };
      }
      return { disabled: true, opacity: 0.2 }; // 흐리게 처리
    }

    //  수정모드 X: 시작일 이전이거나, 오늘 이후거나, 종료일 이후면 아예 선택 불가
    const isTooEarly =
      validStartDate && isBefore(checkDate, startOfDay(validStartDate));
    const isFuture = isAfter(checkDate, today);
    const isAfterEnd = validEndDate
      ? isAfter(checkDate, startOfDay(validEndDate))
      : false;

    if (isTooEarly || isFuture || isAfterEnd) {
      return { disabled: true, opacity: 0.2 }; // 아예 비활성 (흐리게)
    }

    if (activeDays.length > 0) {
      const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
      const dayStr = dayMap[getDay(checkDate)];
      if (!activeDays.includes(dayStr)) return { disabled: true, opacity: 0.5 };
    }

    return { disabled: false, opacity: 1 };
  };

  return (
    <div className="calendar-container">
      <div className="calendar-body">
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

        <div className="calendar-grid calendar-days">
          {calendarDays.map((date, index) => {
            const { disabled, opacity } = getDateStatus(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);

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
              >
                {/* 카테고리별 점 */}
                {renderDayContents && renderDayContents(date)}
              </CalendarDay>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
