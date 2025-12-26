import { useMemo, useState } from "react";
import { useGoals } from "../../../hooks/useGoals";
import useGoalForm from "../../../hooks/useGoalForm";
import PageHeader from "../../common/PageHeader";
import DailyExerciseItem from "../../common/DailyExerciseItem";
import ExerciseSelectModal from "../../ui/ExerciseSelect/ExerciseSelectModal";
import SelectedGoalHeader from "../ExerciseList/ExerciseForm/LoadTab/SelectedGoalHeader";
import GoalItemCard from "../Goal/GoalList/GoalItemCard";
import styles from "./GoalSelectionPanel.module.css";

type Step = "select" | "list" | "detail" | "manual";

interface GoalSelectionPanelProps {
  onClose: () => void;
  onSelectFinalGoal: (goal: any) => void;
}

const GoalSelectionPanel = ({
  onClose,
  onSelectFinalGoal,
}: GoalSelectionPanelProps) => {
  const [step, setStep] = useState<Step>("select");
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { goals, loading } = useGoals();
  const initialManualData = useMemo(() => ({ exercises: [] }), []);

  const {
    goalForm,
    handleAddExercise,
    handleRemoveExercise,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useGoalForm(true, initialManualData as any);

  // 뒤로가기 제어
  const handleBack = () => {
    if (step === "list" || step === "manual") setStep("select");
    else if (step === "detail") setStep("list");
  };

  // 최종 선택 완료
  const handleFinalConfirm = () => {
    if (step === "detail" && selectedGoal) {
      onSelectFinalGoal(selectedGoal);
    } else if (step === "manual") {
      if (goalForm.exercises.length === 0) {
        alert("최소 하나 이상의 운동을 추가해주세요.");
        return;
      }
      onSelectFinalGoal({
        id: "manual",
        name: "공유 목표",
        goalType: "개별운동",
        customExercises: goalForm.exercises,
      });
    }
    onClose();
  };

  return (
    <div className={styles.panel}>
      {step === "select" && (
        <div className={styles.stepContainer}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
          <div className={styles.optionsContainer}>
            <button
              className={styles.optionButton}
              onClick={() => setStep("list")}
            >
              목표 불러오기
            </button>
            <button
              className={styles.optionButton}
              onClick={() => setStep("manual")}
            >
              목표 없이 추가하기
            </button>
          </div>
        </div>
      )}

      {step === "list" && (
        <div className={styles.stepContainer}>
          <PageHeader title="목표 불러오기" onGoBack={handleBack} />
          <div className={styles.scrollArea}>
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              goals.map((goal: any) => (
                <GoalItemCard
                  key={goal.id}
                  goals={{
                    id: goal.id,
                    name: goal.name || goal.title,
                    goalTypeLabel:
                      goal.goalTypeLabel || goal.goalType || "개별",
                    progress: goal.progress || 0,
                    parts: goal.parts || goal.categoryGroup || [],
                    activeDaysLabel:
                      goal.activeDaysLabel ||
                      (goal.activeDays
                        ? goal.activeDays.join(", ")
                        : "요일 정보 없음"),
                    creator: goal.creator || "나",
                  }}
                  hidenMenu={true}
                  onClickOverride={() => {
                    setSelectedGoal(goal);
                    setStep("detail");
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {step === "detail" && (
        <div className={styles.stepContainer}>
          <PageHeader title="목표 확인" onGoBack={handleBack} />
          <div className={styles.scrollArea}>
            <SelectedGoalHeader goal={selectedGoal} onClose={handleBack} />
            <h4 className={styles.listTitle}>운동 목록</h4>
            {selectedGoal.customExercises?.map((ex, idx) => (
              <DailyExerciseItem
                key={ex.exerciseId || idx}
                exercise={ex}
                isReadOnly={true}
              />
            ))}
          </div>
          <button className={styles.confirmButton} onClick={handleFinalConfirm}>
            이 목표로 등록하기
          </button>
        </div>
      )}

      {step === "manual" && (
        <div className={styles.stepContainer}>
          <PageHeader title="직접 추가" onGoBack={handleBack} />
          <div className={styles.scrollArea}>
            {goalForm.exercises.map((ex) => (
              <DailyExerciseItem
                key={ex.id}
                exercise={ex}
                onRemove={handleRemoveExercise}
                onExerciseUpdate={handleExerciseUpdate}
                onSetUpdate={handleSetUpdate}
                onAddSet={handleAddSet}
                onRemoveSet={handleRemoveSet}
                isDurationVisible={false}
              />
            ))}
            <div className={styles.addExerciseArea}>
              <button
                className={styles.addExerciseButton}
                onClick={() => setIsModalOpen(true)}
              >
                + 운동 추가
              </button>
            </div>
          </div>
          <button className={styles.confirmButton} onClick={handleFinalConfirm}>
            등록 완료
          </button>
        </div>
      )}

      {isModalOpen && (
        <ExerciseSelectModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(ex) => {
            handleAddExercise(ex);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default GoalSelectionPanel;
