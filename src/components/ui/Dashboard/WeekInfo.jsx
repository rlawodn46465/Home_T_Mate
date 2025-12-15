import MuscleMap from "../../common/MuscleMap";
import DateCircle from "./DateCircle";
import "./WeekInfo.css";
import { useFetchWeekly } from "../../../hooks/useStats";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";

const WeekInfo = () => {
  const { data, loading, error, refetch } = useFetchWeekly();

  if (loading) {
    return <Spinner text={"불러오는 중..."} />;
  }

  if (error) {
    return (
      <ErrorMessage message="목표를 불러오지 못했습니다." onRetry={refetch} />
    );
  }

  const {
    currentWeek,
    weeklyTargetMuscles,
    todayMinutes,
    weeklyAverageMinutes,
  } = data;

  console.log(weeklyTargetMuscles);

  return (
    <div className="week-info__container">
      <h4 className="section-title">이번주</h4>
      <div className="week-info__content-wrapper">
        {/* 1. 좌측: 근육 맵 시각화 */}
        <div className="week-info__muscle-map-wrapper">
          <MuscleMap selectedTags={weeklyTargetMuscles} />
        </div>

        {/* 2. 우측: 정보 섹션 */}
        <div className="week-info__info-section">
          {/* 요일 헤더 */}
          <div className="week-info__day-header">
            {currentWeek.map((day, index) => (
              <div key={index} className="week-info__day-item">
                {day.day}
              </div>
            ))}
          </div>

          {/* 날짜 원형 */}
          <div className="week-info__date-container">
            {currentWeek.map((dayData, index) => (
              <DateCircle key={index} data={dayData} />
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
