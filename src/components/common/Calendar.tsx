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
import styles from "./Calendar.module.css";

interface CalendarProps {
  startDate?: string | Date | null; // 목표 시작일(이전 날짜 선택 불가)
  endDate?: string | Date | null; // 챌린지 종료일
  activeDays?: string[]; // 활성화된 요일 ["월", "수", "금"]
  selectedDate: string | Date | null; // 현재 선택된 날짜
  onSelectDate: (date: Date) => void; // 날짜 선택 핸들러
  renderDayContents?: (date: Date) => React.ReactNode; // 점(Dot) 등 커스텀 렌더링
  currentMonth?: string | Date; // 부모 상태에서 관리하는 현재 월
  onMonthChange?: (date: Date) => void; // 월 변경 핸들러
  isEditMode?: boolean;
  editDate?: string | Date | null; // 수정 대상 고정 날짜
}

const Calendar = ({
  startDate,
  endDate,
  activeDays = [],
  selectedDate,
  onSelectDate,
  renderDayContents,
  currentMonth,
  onMonthChange,
  isEditMode = false,
  editDate = null,
}: CalendarProps) => {
  // 현재 보고 있는 월의 유효성 검사 및 객체화
  const safeCurrentMonth = useMemo(() => {
    const date = new Date(currentMonth);
    // 유효하지 않으면 오늘 날짜를 기본값으로 사용
    return isValid(date) ? date : new Date();
  }, [currentMonth]);

  // 오늘 날짜 (시간 제외하고 날짜만 비교하기 위함)
  const today = useMemo(() => startOfDay(new Date()), []);

  // 월 이동 핸들러
  const prevMonth = () => {
    onMonthChange(subMonths(safeCurrentMonth, 1));
  };
  const nextMonth = () => {
    onMonthChange(addMonths(safeCurrentMonth, 1));
  };

  // 달력 그리드 생성
  const monthStart = startOfMonth(safeCurrentMonth);
  const monthEnd = endOfMonth(safeCurrentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ko });
  const calendarEnd = endOfWeek(monthEnd, { locale: ko });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 유효한 날짜인지 확인
  const createValidDate = (
    dateProp: string | Date | null | undefined
  ): Date | null => {
    if (!dateProp) return null;
    const dateObj = new Date(dateProp);
    // date-fns의 isValid()를 사용하여 유효성을 확인하고, 유효하지 않으면 null 반환
    return isValid(dateObj) ? dateObj : null;
  };

  const validStartDate = useMemo(() => createValidDate(startDate), [startDate]);
  const validEndDate = useMemo(() => createValidDate(endDate), [endDate]);

  // 🛠️ 날짜 유효성 및 상태 계산 함수
  const getDateStatus = (
    date: Date
  ): { disabled: boolean; opacity: number } => {
    const checkDate = startOfDay(date);

    // 수정 모드일 경우의 로직
    if (isEditMode && editDate) {
      const validEditDate = createValidDate(editDate);
      // 수정 대상 날짜와 같은 날이면 활성화, 아니면 모두 비활성화
      if (validEditDate && isSameDay(checkDate, startOfDay(validEditDate))) {
        return { disabled: false, opacity: 1 };
      }
      return { disabled: true, opacity: 0.2 }; // 흐리게 처리
    }

    //  수정모드 X: 시작일 이전이거나, 오늘 이후거나, 종료일 이후면 아예 선택 불가
    const isTooEarly =
      validStartDate && isBefore(checkDate, startOfDay(validStartDate));
    const isFuture = isAfter(checkDate, today);
    const isAfterEnd =
      validEndDate && isAfter(checkDate, startOfDay(validEndDate));

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
    <div className={styles.calendarContainer}>
      <div className={styles.calendarBody}>
        {/* 네비게이션 */}
        <div className={styles.calendarNav}>
          <button onClick={prevMonth} className={styles.navArrow}>
            {"<"}
          </button>
          <p className={styles.navMonthYear}>
            {format(safeCurrentMonth, "yyyy년 M월", { locale: ko })}
          </p>
          <button onClick={nextMonth} className={styles.navArrow}>
            {">"}
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className={`${styles.calendarGrid} ${styles.calendarWeekdays}`}>
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`${styles.weekdayHeader} 
                ${index === 0 ? styles.isSunday : ""} 
                ${index === 6 ? styles.isSaturday : ""}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className={`${styles.calendarGrid} ${styles.calendarDays}`}>
          {calendarDays.map((date) => {
            const { disabled, opacity } = getDateStatus(date);
            const isSelected =
              selectedDate &&
              isValid(new Date(selectedDate)) &&
              isSameDay(date, new Date(selectedDate));

            return (
              <CalendarDay
                key={date.toString()}
                date={date}
                dayOfMonth={getDate(date)}
                isCurrentMonth={isSameMonth(date, safeCurrentMonth)}
                isToday={isSameDay(date, today)}
                isSelected={isSelected}
                isDisabled={disabled}
                opacity={opacity}
                onClick={() => !disabled && onSelectDate(date)}
              >
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
