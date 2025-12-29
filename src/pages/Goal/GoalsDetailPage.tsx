import { useCallback, useState } from "react";
import GoalsDetailHeader from "../../components/ui/Goal/GoalList/GoalsDetailHeader";
import ExerciseList from "../../components/ui/Goal/GoalList/ExerciseList";
import GoalsSummary from "../../components/ui/Goal/GoalList/GoalsSummary";
import TabNavigation from "../../components/common/TabNavigation";
import { useGoalDetail, useGoalDelete } from "../../hooks/useGoals";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";

import styles from "./GoalsDetailPage.module.css";

interface GoalsDetailPageProps {
  goalId: string | number;
}

type TabType = (typeof TABS)[number];

const TABS = ["오늘 운동", "리스트"] as const;

const GoalsDetailPage = ({ goalId }: GoalsDetailPageProps) => {
  const { navigateToPanel, currentPath } = usePersistentPanel();
  const [activeTab, setActiveTab] = useState<TabType>(TABS[0]);

  const {
    goal,
    loading: detailLoading,
    error: detailError,
  } = useGoalDetail(String(goalId));
  const { isDeleting, deleteGoalHandler, error: deleteError } = useGoalDelete();

  // 뒤로가기 로직
  const handleGoBack = useCallback(() => {
    // 목표 목록 뷰로 전환
    navigateToPanel("?panel=goal", currentPath);
  }, [navigateToPanel, currentPath]);

  // 수정 페이지로 이동
  const handleEdit = useCallback(() => {
    navigateToPanel(
      `?panel=goals-form&goalId=${goalId}&isEditMode=true`,
      currentPath
    );
  }, [navigateToPanel, goalId, currentPath]);

  // 운동 상세 페이지로 이동
  const handleExerciseDetailNavigation = useCallback(
    (exerciseId: string | number) => {
      const newQuery = `?panel=exercise-detail&exerciseId=${exerciseId}`;
      navigateToPanel(newQuery, currentPath);
    },
    [navigateToPanel, currentPath]
  );

  // 목표 삭제
  const handleDelete = async () => {
    if (!goal) return;
    if (window.confirm(`${goal.name} 목표를 정말 삭제하시겠습니까?`)) {
      try {
        await deleteGoalHandler(String(goalId));
        alert("삭제되었습니다.");
        navigateToPanel("?panel=goal", currentPath);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // 로딩 및 에러 상태 처리
  if (detailLoading || isDeleting) {
    return (
      <div className="goals-detail-page">
        <GoalsDetailHeader
          title="목표 상세"
          onGoBack={handleGoBack}
          showBackButton
        />
        <p className="goals-detail-page__error-message">
          {isDeleting ? "목표 삭제 중..." : "목표 정보를 불러오는 중입니다."}
        </p>
      </div>
    );
  }

  // 데이터 로딩 실패/없음 처리
  if (detailError || deleteError || !goal) {
    return (
      <div className="goals-detail-page">
        <GoalsDetailHeader
          title="목표 상세"
          onGoBack={handleGoBack}
          showBackButton
        />
        <p>{detailError || deleteError || "목표 정보 없음"}</p>
      </div>
    );
  }

  // 목표 시작 및 종료(테스트용)
  const handleStartGoal = () => alert(`목표 시작: ${goal.name}!`);
  const handleEndGoal = () => alert(`목표 종료: ${goal.name}!`);

  // 생성일 포맷팅 함수
  const formatCreationDate = (isoString: string) => {
    if (!isoString) return "날짜 정보 없음";
    try {
      return new Date(isoString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("날짜 포맷팅 오류:", e);
      return isoString;
    }
  };

  // 현재 요일 계산
  const currentDay = new Date()
    .toLocaleDateString("ko-KR", { weekday: "short" })
    .replace("요일", "");

  // 오늘 운동 리스트 필터링
  const todayExercises = goal.exercises.filter((ex) =>
    ex.days.includes(currentDay)
  );

  // 모든 운동의 요일을 취합
  const allGoalDays = Array.from(
    new Set(goal.exercises.flatMap((ex) => ex.days || []))
  );

  return (
    <div className={styles.goalsDetailPage}>
      <GoalsDetailHeader
        title={goal.goalType === "CHALLENGE" ? "챌린지 상세" : "루틴 상세"}
        onEdit={handleEdit}
        onGoBack={handleGoBack}
        onDelete={handleDelete}
        showBackButton
        showEditButton
      />

      <div className={styles.goalInfo}>
        <h4>{goal.name}</h4>
        <p className={styles.goalMeta}>
          생성일 : {formatCreationDate(goal.createdAt)}
        </p>
        <p className={styles.goalMeta}>제작자 : {goal.creator}</p>
        <GoalsSummary goalDetail={goal} allGoalDays={allGoalDays} />
      </div>

      <TabNavigation
        tabs={TABS as unknown as string[]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      <div className={styles.exerciseContent}>
        <ExerciseList
          exercises={
            (activeTab === "오늘 운동" ? todayExercises : goal.exercises) as any
          }
          onSelectExercise={handleExerciseDetailNavigation}
        />
      </div>

      <div className={styles.goalActions}>
        <button className={styles.startButton} onClick={handleStartGoal}>
          시작
        </button>
        <button className={styles.endButton} onClick={handleEndGoal}>
          목표 끝내기
        </button>
      </div>
    </div>
  );
};

export default GoalsDetailPage;
