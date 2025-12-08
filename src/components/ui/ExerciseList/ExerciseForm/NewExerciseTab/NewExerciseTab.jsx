import { useCallback, useMemo, useState } from "react";
import { format, subYears } from "date-fns";
import useGoalForm from "../../../../../hooks/useGoalForm";
import {
  useCreateHistory,
  useUpdateHistory,
} from "../../../../../hooks/useHistory";
import NewExerciseList from "./NewExerciseList";
import ExerciseSelectModal from "../../../ExerciseSelect/ExerciseSelectModal";
import Calendar from "../../../../common/Calendar";

import "./NewExerciseTab.css";
import { useNavigate } from "react-router-dom";
import { calculateExerciseStats } from "../../../../../utils/exerciseStats";

const SCREEN = {
  FORM: "form",
  SELECT: "select",
};

const NewExerciseTab = ({ recordId, initialData, initialDate }) => {
  const navigate = useNavigate();

  // 초기 날짜 설정
  const initialSelectedDate = initialDate || new Date();

  // 캘린더 상태
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [currentMonthDate, setCurrentMonthDate] = useState(initialSelectedDate);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(SCREEN.FORM);

  const {
    isSaving: isCreating,
    saveError: createError,
    createHistory,
  } = useCreateHistory();
  const { isUpdating, updateError, updateHistory } = useUpdateHistory(recordId);

  const isSaving = recordId ? isUpdating : isCreating;
  const currentError = recordId ? updateError : createError;

  // useGoalForm 초기 데이터 설정 로직
  const initialGoalData = useMemo(() => {
    if (recordId && initialData) {
      // 수정 모드: 기존 기록 데이터를 기반으로 폼 초기화
      return {
        exercises: initialData.exercises.map((ex) => ({
          ...ex,
          id: ex.exerciseId,
          duration: (ex.totalTime || 0) / 60,
          sets: ex.sets.map((set, index) => ({
            ...set,
            id: set._id || index + 1,
          })),
        })),
      };
    }
    return { exercises: [] }; // 추가 모드 초기값
  }, [recordId, initialData]);

  const {
    goalForm,
    handleAddExercise,
    handleRemoveExercise,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useGoalForm(true, initialGoalData);

  const veryOldDate = useMemo(() => subYears(new Date(), 5), []);
  const today = useMemo(() => new Date(), []);

  // ⭐️ 저장/수정하기
  const handleSave = async () => {
    if (goalForm.exercises.length === 0 || !selectedDate || isSaving) {
      alert("추가할 운동이 없거나 날짜가 선택되지 않았습니다.");
      return;
    }

    const processedExercises = calculateExerciseStats(goalForm.exercises);
    const calculatedTotalSeconds = processedExercises.reduce(
      (acc, curr) => acc + (curr.duration || 0),
      0
    );

    const finalTotalTime =
      calculatedTotalSeconds > 0
        ? calculatedTotalSeconds
        : processedExercises.length * 10 * 60;

    const planData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      type: "개별운동",
      title: "개별운동",
      totalTime: finalTotalTime,
      exercises: processedExercises,
    };

    let success = false;
    if (recordId) {
      // 수정 모드
      success = await updateHistory(planData);
    } else {
      // 추가 모드
      success = await createHistory(planData);
    }

    if (success) {
      alert(
        `✅ 개별 운동 기록이 성공적으로 ${
          recordId ? "수정" : "저장"
        }되었습니다!`
      );
      setSelectedDate(new Date());
      setCurrentMonthDate(new Date());
      navigate("?panel=record", { replace: true });
    } else {
      alert(
        `❌ 운동 기록 ${recordId ? "수정" : "저장"}에 실패했습니다: ${
          currentError || "알 수 없는 오류"
        }`
      );
    }
  };

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
          {isSaving ? `${recordId ? "수정" : "저장"} 중...` : "로딩중..."}
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
