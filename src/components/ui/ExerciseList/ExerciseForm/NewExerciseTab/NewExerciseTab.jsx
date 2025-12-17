import { useMemo, useState } from "react";
import { format, subYears } from "date-fns";
import styles from "./NewExerciseTab.module.css";
import NewExerciseList from "./NewExerciseList";
import ExerciseSelectModal from "../../../ExerciseSelect/ExerciseSelectModal";
import Calendar from "../../../../common/Calendar";
import useGoalForm from "../../../../../hooks/useGoalForm";
import {
  useCreateHistory,
  useUpdateHistory,
} from "../../../../../hooks/useHistory";
import { usePersistentPanel } from "../../../../../hooks/usePersistentPanel";
import { calculateExerciseStats } from "../../../../../utils/exerciseStats";

const SCREEN = { FORM: "form", SELECT: "select" };

const NewExerciseTab = ({ recordId, initialData, initialDate }) => {
  const { navigateToPanel } = usePersistentPanel();
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(SCREEN.FORM);

  const {
    createHistory,
    isSaving: isCreating,
    saveError: createError,
  } = useCreateHistory();
  const { updateHistory, isUpdating, updateError } = useUpdateHistory(recordId);

  const isSaving = recordId ? isUpdating : isCreating;
  const currentError = recordId ? updateError : createError;

  const initialGoalData = useMemo(() => {
    if (recordId && initialData) {
      return {
        exercises: initialData.exercises.map((ex) => ({
          ...ex,
          id: ex.exerciseId,
          duration: (ex.totalTime || 0) / 60,
          sets: ex.sets.map((set, idx) => ({ ...set, id: set._id || idx + 1 })),
        })),
      };
    }
    return { exercises: [] };
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

  const handleSave = async () => {
    if (goalForm.exercises.length === 0 || !selectedDate || isSaving) {
      alert("추가할 운동이 없거나 날짜가 선택되지 않았습니다.");
      return;
    }

    const processedExercises = calculateExerciseStats(goalForm.exercises);
    const totalTime =
      processedExercises.reduce((acc, curr) => acc + (curr.duration || 0), 0) ||
      processedExercises.length * 600;

    const payload = {
      date: format(selectedDate, "yyyy-MM-dd"),
      type: "개별운동",
      title: "개별운동",
      totalTime,
      exercises: processedExercises,
    };

    const success = recordId
      ? await updateHistory(payload)
      : await createHistory(payload);
    if (success) {
      alert(`✅ 기록이 ${recordId ? "수정" : "저장"}되었습니다.`);
      navigateToPanel("?panel=record");
    } else {
      alert(`❌ 실패: ${currentError || "알 수 없는 오류"}`);
    }
  };

  if (currentScreen === SCREEN.SELECT) {
    return (
      <ExerciseSelectModal
        onClose={() => setCurrentScreen(SCREEN.FORM)}
        onSelect={handleAddExercise}
      />
    );
  }

  return (
    <div className={styles.container}>
      {isSaving && (
        <div className={styles.loadingOverlay}>
          {recordId ? "수정 중..." : "저장 중..."}
        </div>
      )}

      <section className={styles.dateSection}>
        <h4 className="section-title">날짜 선택</h4>
        {isCalendarExpanded ? (
          <Calendar
            startDate={subYears(new Date(), 5)}
            endDate={new Date()}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setIsCalendarExpanded(false);
            }}
          />
        ) : (
          <div
            className={styles.collapsedCalendar}
            onClick={() => setIsCalendarExpanded(true)}
          >
            <span className={styles.selectedDateText}>
              {format(selectedDate, "yyyy년 MM월 dd일")}
            </span>
            <span>▼</span>
          </div>
        )}
      </section>

      <NewExerciseList
        exercises={goalForm.exercises}
        onOpenModal={() => setCurrentScreen(SCREEN.SELECT)}
        onRemoveExercise={handleRemoveExercise}
        onExerciseUpdate={handleExerciseUpdate}
        onSetUpdate={handleSetUpdate}
        onAddSet={handleAddSet}
        onRemoveSet={handleRemoveSet}
      />

      <div className={styles.actionArea}>
        <button
          className={styles.saveButton}
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
