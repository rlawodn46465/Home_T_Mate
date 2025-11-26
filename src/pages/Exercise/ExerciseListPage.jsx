import { useEffect, useState } from "react";
import { format } from "date-fns";
import Button from "../../components/common/Button";
import TabNavigation from "../../components/common/TabNavigation";
// import Calendar from "../../components/ui/ExerciseList/Calendar";
import Calendar from "../../components/common/Calendar";
import ExerciseList from "../../components/ui/ExerciseList/ExerciseList";
import "./ExerciseListPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import useDailyExerciseRecords from "../../hooks/useDailyGoalsRecords";
import useMonthlyWorkoutDots from "../../hooks/useMonthlyWorkoutDots";

const TABS = ["전체", "개별운동", "루틴", "챌린지"];
const ALL_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 부위별 색상 매핑 (상수로 분리하여 관리)
const BODY_PART_COLORS = {
  가슴: "#DC3545",
  등: "#FFC107",
  어깨: "#28A745",
  하체: "#007BFF",
  팔: "#17A2B8",
  코어: "#6610F2",
};

const ExerciseListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    records,
    isLoading: isRecordsLoading,
    error: recordsError,
    refetch: refetchDaily,
  } = useDailyExerciseRecords(selectedDate);

  const { monthlyDots, isLoading: isDotsLoading } =
    useMonthlyWorkoutDots(selectedDate);

  useEffect(() => {
  }, [records, selectedDate]);

  // 운동 추가 페이지 이동
  const handleAddExerciseClick = () => {
    navigate(`${location.pathname}?panel=exercise-form`);
  };

  // 달력의 각 날짜에 렌더링할 내용 정의
  const renderDayContents = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const workouts = monthlyDots[dateKey];

    if (!workouts) return null;

    return (
      <div className="workout-dots-container">
        {workouts.map((part, index) => (
          <span
            key={index}
            className="workout-dot"
            style={{ backgroundColor: BODY_PART_COLORS[part] || "#ccc" }}
            title={part} // 마우스 호버 시 부위 이름 표시
          />
        ))}
      </div>
    );
  };

  return (
    <div className="exercise-list-page">
      <div className="exercise-list-header">
        <h2>운동 활동</h2>
        <Button text={"+ 운동 추가"} onClick={handleAddExerciseClick} />
      </div>
      {/* <Calendar /> */}
      <Calendar
        startDate={new Date("2020-01-01")} // 과거 데이터도 볼 수 있게 넉넉히 설정
        activeDays={ALL_DAYS} // 모든 요일 활성화
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        renderDayContents={renderDayContents}
      />

      <div className="calendar-legend">
        {Object.entries(BODY_PART_COLORS).map(([part, color]) => (
          <span key={part} className="legend-item">
            <span
              className="workout-dot legend-dot"
              style={{ backgroundColor: color }}
            />
            {part}
          </span>
        ))}
      </div>

      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="exercise-list-box">
        <ExerciseList activeTab={activeTab} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default ExerciseListPage;
