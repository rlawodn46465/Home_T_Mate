import { useMemo, useState } from "react";
import { useGoals } from "../../../hooks/useGoals";
import useGoalForm from "../../../hooks/useGoalForm";
import PageHeader from "../../common/PageHeader";
import DailyExerciseItem from "../../common/DailyExerciseItem";
import ExerciseSelectModal from "../../ui/ExerciseSelect/ExerciseSelectModal";
import SelectedGoalHeader from "../ExerciseList/ExerciseForm/LoadTab/SelectedGoalHeader";
import GoalItemCard from "../Goal/GoalList/GoalItemCard";
import "./GoalSelectionPanel.css";

const GoalSelectionPanel = ({ onClose, onSelectFinalGoal }) => {
  const [step, setStep] = useState("select");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  } = useGoalForm(true, initialManualData);

  // 뒤로가기 제어
  const handleBack = () => {
    if (step === "list" || step === "manual") setStep("select");
    else if (step === "detail") setStep("list");
  };

  // 최종 선택 완료 (게시글 작성 페이지로 데이터 전달)
  const handleFinalConfirm = () => {
    if (step === "detail") {
      // 목표 불러오기 완료
      onSelectFinalGoal(selectedGoal);
    } else if (step === "manual") {
      // 직접 입력 완료
      if (goalForm.exercises.length === 0) {
        alert("최소 하나 이상의 운동을 추가해주세요.");
        return;
      }
      onSelectFinalGoal({
        id: "manual",
        name: "직접 입력한 운동",
        goalType: "개별운동",
        customExercises: goalForm.exercises,
      });
    }
    onClose();
  };

  return (
    <div className="goal-selection-panel">
      {step === "select" && (
        <>
          <button className="close-button" onClick={onClose}>
            x
          </button>
          <div className="panel-options">
            <button
              className="option-button goal-select"
              onClick={() => setStep("list")}
            >
              목표 불러오기
            </button>
            <button
              className="option-button add-without-goal"
              onClick={() => setStep("manual")}
            >
              목표 없이 추가하기
            </button>
          </div>
        </>
      )}
      {step === "list" && (
        <div className="goal-list-step">
          <PageHeader title={"목표 불러오기"} onGoBack={handleBack} />
          <div className="goal-list-scroll">
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              goals.map((goal) => (
                <GoalItemCard
                  key={goal.id}
                  goals={goal}
                  onClickOverride={() => {
                    setSelectedGoal(goal);
                    setStep("detail");
                  }}
                  hidenMenu={true}
                />
              ))
            )}
          </div>
        </div>
      )}
      {step === "detail" && (
        <div className="goal-detail-step">
          <PageHeader title="목표 불러오기" onGoBack={handleBack} />
          <div className="detail-content-scroll">
            <SelectedGoalHeader goal={selectedGoal} onClose={handleBack} />
            <div className="exercise-list-area">
              <h4 className="list-title">운동 목록</h4>
              {selectedGoal.customExercises?.map((ex, idx) => (
                <DailyExerciseItem
                  key={ex.exerciseId || idx}
                  exercise={ex}
                  isDaySelector={false}
                  isReadOnly={true}
                />
              ))}
            </div>
          </div>
          <button
            className="confirm-selection-button"
            onClick={handleFinalConfirm}
          >
            이 목표로 등록하기
          </button>
        </div>
      )}
      {step === "manual" && (
        <div className="goal-manual-step">
          <PageHeader title="목표 없이 추가하기" onGoBack={handleBack} />
          <div className="manual-content-scroll">
            <div className="exercise-list-area">
              {goalForm.exercises.map((ex) => (
                <DailyExerciseItem
                  key={ex.id}
                  exercise={ex}
                  onRemove={handleRemoveExercise}
                  onExerciseUpdate={handleExerciseUpdate}
                  onSetUpdate={handleSetUpdate}
                  onAddSet={handleAddSet}
                  onRemoveSet={handleRemoveSet}
                  isDaySelector={false}
                  isDurationVisible={false}
                />
              ))}
              <div className="add-exercise-area">
                <button
                  className="add-exercise-button"
                  onClick={() => setIsModalOpen(true)}
                >
                  + 운동 추가
                </button>
              </div>
            </div>
          </div>
          <button
            className="confirm-selection-button"
            onClick={handleFinalConfirm}
          >
            등록 완료
          </button>
        </div>
      )}
      {/* 운동 선택 모달 */}
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
