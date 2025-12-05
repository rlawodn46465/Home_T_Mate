import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./GoalsDetailPage.css";
import GoalsDetailHeader from "../../components/ui/Goal/GoalList/GoalsDetailHeader";
import ExerciseList from "../../components/ui/Goal/GoalList/ExerciseList";
import GoalsSummary from "../../components/ui/Goal/GoalList/GoalsSummary";
import TabNavigation from "../../components/common/TabNavigation";
import { useGoalDetail } from "../../hooks/useGoalDetail";
import { useGoalDelete } from "../../hooks/useGoalDelete";

const TABS = ["오늘 운동", "리스트"];
const GoalsDetailPage = ({ goalId }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TABS[0]);

  const {
    goal: goalDetail,
    loading: detailLoading,
    error: detailError,
  } = useGoalDetail(goalId, true);

  const { isDeleting, deleteGoalHandler } = useGoalDelete();

  // 로딩 및 에러 상태 처리
  if (detailLoading || isDeleting) {
    return (
      <div className="goals-detail-page">
        <GoalsDetailHeader
          title="루틴 상세"
          onGoBack={() => navigate(-1)}
          showBackButton={true}
        />
        <p className="goals-detail-page__error-message">
          {isDeleting ? "루틴 삭제 중..." : "루틴 정보를 불러오는 중입니다."}
        </p>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="goals-detail-page">
        <GoalsDetailHeader
          title="루틴 상세"
          onGoBack={() => navigate(-1)}
          showBackButton={true}
        />
        <p className="goals-detail-page__error-message">{detailError}</p>
      </div>
    );
  }

  // 데이터 로딩 실패/없음 처리
  if (!goalDetail) {
    return (
      <div className="goals-detail-page">
        <GoalsDetailHeader
          title="루틴 상세"
          onGoBack={() => navigate(-1)}
          showBackButton={true}
        />
        <p className="goals-detail-page__error-message">
          루틴 정보를 찾을 수 없습니다. (ID: {goalId})
        </p>
      </div>
    );
  }

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/?panel=goals-form&goalId=${goalId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // 루틴 삭제
  const handleDelete = async () => {
    if (window.confirm(`${goalDetail.name} 루틴을 정말 삭제하시겠습니까?`)) {
      try {
        await deleteGoalHandler(goalId);
        alert("루틴이 성공적으로 삭제되었습니다.");
        navigate("/?panel=goal");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // 루틴 시작
  const handleStartGoal = () => {
    alert(`루틴 시작: ${goalDetail.name}!`);
    // 루틴 시작 로직 (타이머 시작, 운동 기록 등)
  };

  const handleEndGoal = () => {
    alert(`루틴 종료: ${goalDetail.name}!`);
    // 루틴 종료 로직 (결과 저장 등)
  };

  //
  const formatCreationDate = (isoString) => {
    if (!isoString) return "날짜 정보 없음";

    try {
      const date = new Date(isoString);
      // 한국 로케일을 사용하여 'YYYY년 M월 D일' 형식으로 변환
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("날짜 포맷팅 오류:", e);
      return isoString; // 오류 발생 시 원본 문자열 반환
    }
  };

  const currentExercises = goalDetail.exercises || [];

  // 현재 요일 계산
  const currentDay = new Date()
    .toLocaleDateString("ko-KR", { weekday: "short" })
    .replace("요일", "");

  // 오늘 운동 리스트 필터링
  const todayExercises = goalDetail.exercises.filter((ex) =>
    ex.days.includes(currentDay)
  );

  // 모든 운동의 요일을 취합
  const allGoalDays = [
    ...new Set(currentExercises.flatMap((ex) => ex.days || [])),
  ];

  const handleExerciseDetailNavigation = (exerciseId) => {
    navigate(`/?panel=exercise-detail&exerciseId=${exerciseId}`);
  };

  return (
    <div className="goals-detail-page">
      <GoalsDetailHeader
        title={
          goalDetail.goalType === "Challenge"
            ? "챌린지 상세"
            : "루틴 상세"
        }
        onEdit={handleEdit}
        onGoBack={handleGoBack}
        showBackButton={true}
        showEditButton={true}
        onDelete={handleDelete}
      />
      <div className="goal-info">
        <h4>{goalDetail.name}</h4>
        <p className="goal-meta">
          생성일 : {formatCreationDate(goalDetail.createdAt)}
        </p>
        <p className="goal-meta">제작자 : {goalDetail.creator}</p>
        <GoalsSummary
          goalDetail={goalDetail}
          allGoalDays={allGoalDays}
        />
      </div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="exercise-content">
        {activeTab === "오늘 운동" && (
          <ExerciseList
            exercises={todayExercises}
            onSelectExercise={handleExerciseDetailNavigation}
          />
        )}
        {activeTab === "리스트" && (
          <ExerciseList
            exercises={goalDetail.exercises}
            onSelectExercise={handleExerciseDetailNavigation}
          />
        )}
      </div>
      <div className="goal-actions">
        <button className="start-button" onClick={handleStartGoal}>
          시작
        </button>
        <button className="end-button" onClick={handleEndGoal}>
          루틴 끝내기
        </button>
      </div>
    </div>
  );
};

export default GoalsDetailPage;
