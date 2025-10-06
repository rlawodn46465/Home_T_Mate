// import { useState } from "react";
import MuscleMap from "../../common/MuscleMap";
import DateCircle from "./DateCircle";
import "./WeekInfo.css";

const DUMMY_DATA = {
  currentWeek: [
    { date: 7, day: "일", minutes: 60, isToday: false, isWorkout: true },
    { date: 8, day: "월", minutes: 0, isToday: false, isWorkout: false },
    { date: 9, day: "화", minutes: 120, isToday: false, isWorkout: true },
    { date: 10, day: "수", minutes: 90, isToday: true, isWorkout: true },
    { date: 11, day: "목", minutes: 0, isToday: false, isWorkout: false },
    { date: 12, day: "금", minutes: 0, isToday: false, isWorkout: false },
    { date: 13, day: "토", minutes: 0, isToday: false, isWorkout: false },
  ],
  todayMinutes: 0,
  weeklyAverageMinutes: 60,
  weeklyMuscles: ["가슴", "대퇴사두"],
};

const WeekInfo = () => {
  const { currentWeek, todayMinutes, weeklyAverageMinutes, weeklyMuscles } =
    DUMMY_DATA;

  // 요일 헤더 추출
  const dayNames = currentWeek.map((item) => item.day);

  const selectedTags = weeklyMuscles;

  return (
    <div className="week-info__container">
      <h4 className="section-title">이번주</h4>
      <div className="week-info__content-wrapper">
        {/* 1. 좌측: 근육 맵 시각화 */}
        <div className="week-info__muscle-map-wrapper">
          <MuscleMap selectedTags={selectedTags} />
        </div>

        {/* 2. 우측: 정보 섹션 */}
        <div className="week-info__info-section">
          {/* 요일 헤더 */}
          <div className="week-info__day-header">
            {dayNames.map((day) => (
              <div key={day} className="week-info__day-item">
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 원형 */}
          <div className="week-info__date-container">
            {currentWeek.map((dayData) => (
              <DateCircle key={dayData.date} data={dayData} />
            ))}
          </div>

          {/* 운동 요약 정보 */}
          <div className="week-info__summary-wrapper">
            <div className="week-info__summary-item">
              <div className="week-info__summary-label">오늘(분)</div>
              <div className="week-info__summary-value">{todayMinutes}</div>
            </div>
            <div className="week-info__summary-line"></div>
            <div className="week-info__summary-item">
              <div className="week-info__summary-label">주간 평균(분)</div>
              <div className="week-info__summary-value">
                {weeklyAverageMinutes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekInfo;
