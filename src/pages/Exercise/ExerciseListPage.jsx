import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import TabNavigation from "../../components/common/TabNavigation";
import Calendar from "../../components/common/Calendar";
import ExerciseList from "../../components/ui/ExerciseList/ExerciseList";

import { useMonthlyHistory } from "../../hooks/useMonthlyHistory";

import "./ExerciseListPage.css";
import { useHistoryActions } from "../../hooks/useHistoryActions";

const TABS = ["전체", "개별운동", "루틴", "챌린지"];
const ALL_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

// 부위별 색상 매핑
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
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 데이터 불러오기
  const { historyData, isLoading, error, refetch } = useMonthlyHistory(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1
  );

  // 삭제/수정 액션 훅
  const { isProcessing, handleDelete } =
    useHistoryActions(refetch);

  // 캘린더 전달 데이터 가공
  const monthlyDots = useMemo(() => {
    if (!historyData || historyData.length === 0) return {};

    const aggregatedData = historyData.reduce((acc, curr) => {
      const dateKey = curr.date;
      const currentCategories = curr.categoryGroup || [];

      const existingCategories = acc[dateKey] || [];
      const combinedCategories = [...existingCategories, ...currentCategories];
      const uniqueCategories = Array.from(new Set(combinedCategories));
      acc[dateKey] = uniqueCategories;

      return acc;
    }, {});
    return aggregatedData;
  }, [historyData]);

  // 운동 추가 페이지 이동
  const handleAddExerciseClick = () => {
    navigate(`${location.pathname}?panel=exercise-form`);
  };

  // 달력 날짜별 렌더링 함수
  const renderDayContents = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const categories = monthlyDots[dateKey] || [];
    if (categories.length === 0) return null;

    return (
      <div className="workout-dots-container">
        {Array.isArray(categories) &&
          categories.map((part, index) => (
            <span
              key={index}
              className="workout-dot"
              style={{ backgroundColor: BODY_PART_COLORS[part] || "#ccc" }}
              title={part}
            />
          ))}
      </div>
    );
  };

  // 기록 삭제 핸들러
  const handleDeleteRecord = async (recordId) => {
    const success = await handleDelete(recordId);
    if (success) {
      alert("✅ 운동 기록이 삭제되었습니다!");
    } else {
      alert("❌ 운동 기록 삭제에 실패했습니다.");
    }
  };

  // 기록 수정 핸들러 (수정 모달/페이지 이동 로직)
  const handleEditRecord = (recordData) => {
    navigate(
      `${location.pathname}?panel=exercise-edit&recordId=${recordData.id}`
    ); // 실제 수정 API 호출(handleUpdate)은 수정 폼에서 데이터를 저장할 때 실행
  };

  return (
    <div className="exercise-list-page">
      <div className="exercise-list-header">
        <h2>운동 활동</h2>
        <Button text={"+ 운동 추가"} onClick={handleAddExerciseClick} />
      </div>
      <Calendar
        startDate={new Date("2020-01-01")} // 과거 데이터도 볼 수 있게 넉넉히 설정
        activeDays={ALL_DAYS} // 모든 요일 활성화
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        currentMonth={currentMonthDate}
        onMonthChange={setCurrentMonthDate}
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
        {isLoading || isProcessing ? (
          <div className="loading-message">
            {isProcessing ? "처리 중..." : "데이터를 불러오는 중입니다..."}
          </div>
        ) : error ? (
          <div className="error-message">데이터 로딩 실패</div>
        ) : (
          <ExerciseList
            activeTab={activeTab}
            selectedDate={selectedDate}
            monthlyData={historyData}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseListPage;
