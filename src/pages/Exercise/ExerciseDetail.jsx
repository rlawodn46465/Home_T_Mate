import { useEffect, useState } from "react";
import MuscleMap from "../../components/common/MuscleMap";
import TabNavigation from "../../components/common/TabNavigation";
import "./ExerciseDetail.css";
import ExerciseInfoSection from "../../components/ui/Exercise/ExerciseInfoSection";
import ExerciseRecordSection from "../../components/ui/Exercise/ExerciseRecordSection";
import { fetchExerciseDetail } from "../../services/api/goalApi";
import PageHeader from "../../components/common/PageHeader";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";

const ExerciseDetail = ({ exerciseId }) => {
  const TABS = ["설명", "나의 기록"];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // 데이터 상태와 로딩 상태 정의
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메모 상태
  const [persistedMemo, setPersistedMemo] = useState("");

  useEffect(() => {
    if (!exerciseId) {
      setError("유효한 운동 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchExerciseDetail(exerciseId);

        if (!isCancelled) {
          setDetailData(data);

          if (data.myStats && data.myStats.memo) {
            setPersistedMemo(data.myStats.memo);
          }
        }
      } catch (err) {
        console.error("상세 정보 로드 실패:", err);
        if (!isCancelled) {
          setError("정보를 불러오는데 실패했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [exerciseId]);

  // 메모 저장 핸들러
  const handleMemoSave = (newMemo) => {
    setPersistedMemo(newMemo);
    console.log("메모 저장 완료 : ", newMemo);
  };

  const { navigateToPanel } = usePersistentPanel();

  const handleGoBackToRecordList = () => {
    navigateToPanel("?panel=record");
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        🏃‍♂️ 운동 상세 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return <div className="error-state">❌ 오류: {error}</div>;
  }

  if (!detailData) {
    return <div className="error-state">데이터가 존재하지 않습니다.</div>;
  }

  return (
    <div className="exercise-detail-page">
      <PageHeader
        title={"운동 기록 상세"}
        onGoBack={handleGoBackToRecordList}
      />
      <div className="exercise-header">
        {detailData.exercise.targetMuscles && (
          <MuscleMap selectedTags={detailData.exercise.targetMuscles} />
        )}
        <div className="exercise-header-info">
          <h4>{detailData.exercise.name}</h4>
          <p>부위 : {detailData.exercise.targetMuscles.join(", ")}</p>
          <p>장비 : {detailData.exercise.equipment}</p>
        </div>
      </div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "설명" && (
        <ExerciseInfoSection
          description={detailData.exercise.description}
          initialMemo={persistedMemo}
          onMemoSave={handleMemoSave}
        />
      )}
      {activeTab === "나의 기록" && (
        <ExerciseRecordSection
          myStats={detailData.myStats}
          recentLogs={detailData.recentLogs}
        />
      )}
    </div>
  );
};

export default ExerciseDetail;
