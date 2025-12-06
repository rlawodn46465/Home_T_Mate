import { useCallback, useMemo, useState } from "react";
import { format, subYears } from "date-fns";
import useGoalForm from "../../../../../hooks/useGoalForm";
import { useCreateHistory } from "../../../../../hooks/useHistory";
import NewExerciseList from "./NewExerciseList";
import ExerciseSelectModal from "../../../ExerciseSelect/ExerciseSelectModal";
import Calendar from "../../../../common/Calendar";

import "./NewExerciseTab.css";
import { useNavigate } from "react-router-dom";

const SCREEN = {
  FORM: "form",
  SELECT: "select",
};

// 운동 통계 계산 함수
const calculateExerciseStats = (exercises) => {
  return exercises.map((ex) => {
    let maxWeight = 0;
    let totalVolume = 0;
    let totalReps = 0;

    const setsArray = ex.sets && Array.isArray(ex.sets) ? ex.sets : [];

    const setsWithCompletion = setsArray.map((set, index) => {
      const weight = set.weight || 0;
      const reps = set.reps || 0;

      const volume = weight * reps;
      totalVolume += volume;
      totalReps += reps;

      if (weight > maxWeight) {
        maxWeight = weight;
      }

      return {
        setNumber: set.setNumber || index + 1,
        weight: weight,
        reps: reps,
        isCompleted: true,
      };
    });

    return {
      exerciseId: ex._id || ex.exerciseId, // ID는 _id 또는 exerciseId 사용
      name: ex.name,
      sets: setsWithCompletion,
      maxWeight: maxWeight,
      totalVolume: totalVolume,
      totalReps: totalReps,
    };
  });
};

const NewExerciseTab = () => {
  const navigate = useNavigate();

  // 캘린더 상태
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(SCREEN.FORM);

  const { isSaving, saveError, createHistory } = useCreateHistory();
  const {
    goalForm,
    handleAddExercise,
    handleRemoveExercise,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useGoalForm();

  const veryOldDate = useMemo(() => subYears(new Date(), 5), []);
  const today = useMemo(() => new Date(), []);

  // 날짜 선택 핸들러
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setIsCalendarExpanded(false);
  };

  // 달력 토글 (접힌 날짜 클릭 시)
  const toggleCalendar = () => {
    setIsCalendarExpanded((prev) => !prev);
  };

  // 모달 제어 핸들러
  const handleCloseSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.FORM);
  }, []);

  const handleOpenSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.SELECT);
  }, []);

  const handleSave = async () => {
    if (goalForm.exercises.length === 0 || !selectedDate || isSaving) {
      alert("추가할 운동이 없거나 날짜가 선택되지 않았습니다.");
      return;
    }

    // 데이터 가공
    const processedExercises = calculateExerciseStats(goalForm.exercises);
    // totalTime 계산 (임시)
    const estimatedTotalTime = processedExercises.length * 10 * 60;

    // 서버 전송 데이터 구성
    const planData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      type: "개별운동",
      title: "개별운동",
      totalTime: estimatedTotalTime,
      exercises: processedExercises,
    };

    console.log("서버로 전송할 개별 운동 기록 데이터:", planData);

    // API 호출
    const success = await createHistory(planData);

    if (success) {
      alert("✅ 개별 운동 기록이 성공적으로 저장되었습니다!");
      setSelectedDate(new Date());
      setCurrentMonthDate(new Date());
      navigate("?panel=record", { replace: true });
    } else {
      alert(
        `❌ 운동 기록 저장에 실패했습니다: ${saveError || "알 수 없는 오류"}`
      );
    }
  };

  // 운동 선택 모달 렌더링
  if (currentScreen === SCREEN.SELECT) {
    return (
      <ExerciseSelectModal
        onClose={handleCloseSelectModal}
        onSelect={handleAddExercise}
      />
    );
  }

  return (
    <div className="new-exercise-tab">
      {isSaving && (
        <div className="loading-overlay">
          {isSaving ? "운동 기록 저장 중..." : "로딩중..."}
        </div>
      )}

      {/* 날짜 선택 */}
      <div className="date-selection-section">
        <div className="section-title">날짜 선택</div>
        {isCalendarExpanded ? (
          <Calendar
            startDate={veryOldDate}
            endDate={today}
            activeDays={[]}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            currentMonth={currentMonthDate}
            onMonthChange={setCurrentMonthDate}
          />
        ) : (
          // 달력(접힌 상태)
          <div className="collapsed-calendar-view" onClick={toggleCalendar}>
            <span className="selected-date-text">
              {selectedDate
                ? format(selectedDate, "yyyy년 MM월 dd일")
                : "날짜 선택"}
            </span>
            <span className="toggle-icon">▼</span>
          </div>
        )}
      </div>

      {/* 운동 목록 입력 */}
      <NewExerciseList
        exercises={goalForm.exercises}
        onOpenModal={handleOpenSelectModal}
        onRemoveExercise={handleRemoveExercise}
        onExerciseUpdate={handleExerciseUpdate}
        onSetUpdate={handleSetUpdate}
        onAddSet={handleAddSet}
        onRemoveSet={handleRemoveSet}
      />

      {/* 저장 버튼 */}
      <div className="bottom-action-area">
        <button
          className={`save-button ${
            !selectedDate || isSaving ? "disabled" : ""
          }`}
          disabled={!selectedDate || isSaving}
          onClick={handleSave}
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
};

export default NewExerciseTab;
