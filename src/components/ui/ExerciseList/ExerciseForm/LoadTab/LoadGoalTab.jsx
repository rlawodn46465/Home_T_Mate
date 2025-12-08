import { addWeeks, format } from "date-fns";
import { useState, useMemo } from "react";
import {
  useCreateHistory,
  useUpdateHistory,
} from "../../../../../hooks/useHistory";
import SelectedGoalHeader from "./SelectedGoalHeader";
import Calendar from "../../../../common/Calendar";
import DailyExerciseList from "./DailyExerciseList";

import "./LoadGoalTab.css";
import GoalItemCard from "../../../Goal/GoalList/GoalItemCard";
import useGoalForm from "../../../../../hooks/useGoalForm";
import { useGoals } from "../../../../../hooks/useGoals";
import { useNavigate } from "react-router-dom";
import { calculateExerciseStats } from "../../../../../utils/exerciseStats";

const getDayOfWeekKorean = (date) => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return days[date.getDay()];
};

const LoadGoalTab = ({ recordId, initialData, initialDate }) => {
  const { goals, loading: isGoalsLoading, error: goalsError } = useGoals();

  const navigate = useNavigate();

  // 수정 모드 초기 상태 설정
  const initialGoalValue = useMemo(() => {
    if (recordId && initialData) {
      return {
        id: initialData.userGoalId,
        name: initialData.title,
        goalTypeLabel: initialData.type,
        goalType: initialData.type, // SelectedGoalHeader를 위해 type 필드도 추가
        durationWeek: initialData.durationWeek,
        startDate: initialData.startDate,
        activeDays: initialData.activeDays,
        parts: initialData.categoryGroup || [], // 서버 응답에 categoryGroup이 있다면 사용
        creator: "나", // 수정 기록은 사용자가 생성했다고 가정
      };
    }
    return null;
  }, [recordId, initialData]);

  const initialSelectedDate = initialDate || new Date();

  const [selectedGoal, setSelectedGoal] = useState(initialGoalValue);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(!recordId);
  const [currentMonthDate, setCurrentMonthDate] = useState(initialSelectedDate);

  const {
    isSaving: isCreating,
    saveError: createError,
    createHistory,
  } = useCreateHistory();
  const { isUpdating, updateError, updateHistory } = useUpdateHistory(recordId);

  const isSaving = recordId ? isUpdating : isCreating;
  const currentError = recordId ? updateError : createError;

  const initialGoalData = useMemo(() => {
    if (recordId && initialData) {
      // 수정 모드: 기존 기록 데이터를 기반으로 초기화
      return {
        id: initialData.userGoalId,
        name: initialData.title,
        goalType: initialData.type,
        startDate: initialData.startDate,
        activeDays: initialData.activeDays,
        durationWeek: initialData.durationWeek,
        goalWeeks: 0,
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
    // 추가 모드: 목표 선택 시 데이터 로드
    if (!selectedGoal) return null;
    return {
      name: selectedGoal.name,
      goalType: selectedGoal.goalTypeLabel,
      goalWeeks: selectedGoal.durationWeek,
      exercises: selectedGoal.customExercises.map((ex) => ({
        ...ex,
        id: ex.exerciseId,
        duration: ex.duration || 0,
        sets: ex.sets.map((set) => ({
          ...set,
          id: set._id || Date.now() + Math.random(),
        })),
      })),
    };
  }, [selectedGoal, recordId, initialData]);

  const initialRecordDate = useMemo(() => {
    if (recordId && initialData) {
      return new Date(initialData.date); // 서버에서 받은 기록 날짜
    }
    return null;
  }, [recordId, initialData]);

  const {
    goalForm,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useGoalForm(true, initialGoalData);

  // 목표 선택
  const handleSelectGoal = (goalListItem) => {
    if (recordId) return;
    if (goalListItem) {
      setSelectedGoal(goalListItem);
      setIsCalendarExpanded(true);
      setSelectedDate(new Date());
    }
  };

  // 목표 취소(x버튼)
  const handleDeselectGoal = () => {
    if (recordId) return navigate("/?panel=record");
    setSelectedGoal(null);
    setSelectedDate(null);
  };

  // 날짜 선택
  const handleSelectDate = (date) => {
    if (
      recordId &&
      format(date, "yyyy-MM-dd") !== format(initialRecordDate, "yyyy-MM-dd")
    ) {
      return;
    }
    setSelectedDate(date);
    setIsCalendarExpanded(false);
  };

  // 달력 토글 (접힌 날짜 클릭 시)
  const toggleCalendar = () => {
    setIsCalendarExpanded((prev) => !prev);
  };

  // 운동 목록 계산
  const exercisesForSelectedDay = useMemo(() => {
    if (recordId && initialData) {
      return goalForm.exercises || [];
    }
    if (!selectedDate || !goalForm.exercises) return [];

    const currentDay = getDayOfWeekKorean(selectedDate);

    return goalForm.exercises.filter(
      (ex) => ex.days && ex.days.includes(currentDay)
    );
  }, [selectedDate, goalForm.exercises, recordId, initialData]);

  // 저장/수정하기
  const handleSave = async () => {
    const currentGoal =
      selectedGoal ||
      (recordId
        ? {
            id: initialData?.userGoalId,
            goalType: initialData?.type,
            name: initialData?.title,
          }
        : null);

    if (!currentGoal || !selectedDate || isSaving) return;

    // 필터된 운동 목록
    const exercisesToSave = exercisesForSelectedDay;

    if (exercisesToSave.length === 0) {
      alert("⚠️ 선택한 날짜에 해당하는 운동 루틴이 없습니다.");
      return;
    }

    // 데이터 가공
    const processedExercises = calculateExerciseStats(exercisesToSave);

    // totalTime 계산(임시)
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
      userGoalId: currentGoal.id,
      type: currentGoal.goalType.toUpperCase(),
      title: currentGoal.name,
      totalTime: finalTotalTime,
      exercises: processedExercises,
    };

    console.log(
      `서버로 전송할 ${recordId ? "수정" : "저장"} 데이터:`,
      planData
    );

    // API 호출
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
        `✅ 운동 기록이 성공적으로 ${recordId ? "수정" : "저장"}되었습니다!`
      );
      handleDeselectGoal();
    } else {
      alert(
        `❌ 운동 기록 ${recordId ? "수정" : "저장"}에 실패했습니다: ${
          currentError || "알 수 없는 오류"
        }`
      );
    }
  };

  // 챌린지 종료일 계산
  const challengeEndDate =
    selectedGoal &&
    selectedGoal?.goalTypeLabel === "챌린지" &&
    selectedGoal.durationWeek
      ? addWeeks(new Date(selectedGoal.startDate), selectedGoal.durationWeek)
      : null;

  return (
    <div className="load-goal-container">
      {(isGoalsLoading || isSaving) && (
        <div className="loading-overlay">
          {isSaving ? `${recordId ? "수정" : "저장"} 중...` : "로딩중..."}
        </div>
      )}
      {/* 목표 리스트 */}
      {!selectedGoal && !recordId && (
        <div className="goal-list-wrapper">
          {goalsError && (
            <div className="error-text">
              ❌ 목표 목록을 불러오지 못했습니다.
            </div>
          )}

          {!isGoalsLoading && goals.length > 0 ? (
            goals.map((goal) => (
              <div key={goal.id}>
                <GoalItemCard
                  goals={goal}
                  onClickOverride={() => handleSelectGoal(goal)}
                  hidenMenu={true}
                />
              </div>
            ))
          ) : (
            <div className="no-data-text">등록된 루틴이 없습니다.</div>
          )}
        </div>
      )}
      {/* 목표 선택 후 화면 */}
      {(selectedGoal || recordId) && (
        <>
          {/* 상단 고정 헤더 */}
          <SelectedGoalHeader
            goal={selectedGoal || initialData}
            onClose={handleDeselectGoal}
          />
          {/* 날짜 선택 */}
          <div className="date-selection-section">
            <div className="section-title">날짜 선택</div>
            {/* 달력(펼친 상태)*/}
            {!recordId && isCalendarExpanded ? (
              <Calendar
                startDate={selectedGoal.startDate}
                endDate={challengeEndDate}
                activeDays={selectedGoal.activeDays}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                currentMonth={currentMonthDate}
                onMonthChange={setCurrentMonthDate}
                isEditMode={!!recordId}
                editDate={initialRecordDate}
              />
            ) : (
              // 달력(접힌 상태)
              <div
                className="collapsed-calendar-view"
                onClick={!recordId ? toggleCalendar : undefined}
                style={{ cursor: recordId ? "default" : "pointer" }}
              >
                <span className="selected-date-text">
                  {selectedDate
                    ? format(selectedDate, "yyyy년 MM월 dd일")
                    : "날짜 선택"}
                </span>
                {!recordId && <span className="toggle-icon">▼</span>}
              </div>
            )}
          </div>
          {/* 운동 목록 */}
          {selectedDate && (
            <DailyExerciseList
              exercises={exercisesForSelectedDay}
              date={selectedDate}
              onExerciseUpdate={handleExerciseUpdate}
              onSetUpdate={handleSetUpdate}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
            />
          )}

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
        </>
      )}
    </div>
  );
};

export default LoadGoalTab;
