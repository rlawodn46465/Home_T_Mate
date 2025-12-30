import { useEffect, useState } from "react";
import MuscleMap from "../../components/common/MuscleMap";
import TabNavigation from "../../components/common/TabNavigation";
import ExerciseInfoSection from "../../components/ui/Exercise/ExerciseInfoSection";
import ExerciseRecordSection from "../../components/ui/Exercise/ExerciseRecordSection";
import PageHeader from "../../components/common/PageHeader";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

import styles from "./ExerciseDetail.module.css";
import { useExerciseDetail } from "../../hooks/useExercises";

interface ExerciseDetailProps {
  exerciseId: string | number;
}

type TabType = (typeof TABS)[number];

const TABS = ["설명", "나의 기록"] as const;

const ExerciseDetail = ({ exerciseId }: ExerciseDetailProps) => {
  const { detailData, isLoading, error } = useExerciseDetail(exerciseId);
  const { navigateToPanel } = usePersistentPanel();

  const [activeTab, setActiveTab] = useState<TabType>(TABS[0]);
  const [persistedMemo, setPersistedMemo] = useState("");

  // 기록 목록으로 돌아가기
  const handleGoBackToRecordList = () => {
    navigateToPanel("?panel=record");
  };

  useEffect(() => {
    if (detailData?.myStats?.memo) {
      setPersistedMemo(detailData.myStats.memo);
    }
  }, [detailData]);

  if (isLoading)
    return <Spinner text={"🏃‍♂️ 운동 상세 정보를 불러오는 중입니다..."} />;
  if (error) return <ErrorMessage message={`❌ 오류: ${error}`} />;
  if (!detailData)
    return <div className={styles.errorState}>데이터가 존재하지 않습니다.</div>;

  const { exercise, myStats, recentLogs } = detailData;

  return (
    <div className={styles.exerciseDetailPage}>
      <PageHeader
        title={"운동 기록 상세"}
        onGoBack={handleGoBackToRecordList}
      />
      <div className={styles.exerciseHeader}>
        {exercise.targetMuscles && (
          <MuscleMap selectedTags={exercise.targetMuscles} />
        )}
        <div className={styles.exerciseHeaderInfo}>
          <h4 className={styles.exerciseName}>{exercise.name}</h4>
          <p className={styles.exerciseMeta}>
            부위 : {exercise.targetMuscles.join(", ")}
          </p>
          <p className={styles.exerciseMeta}>장비 : {exercise.equipment}</p>
        </div>
      </div>
      <TabNavigation
        tabs={TABS as unknown as string[]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />
      {activeTab === "설명" && (
        <ExerciseInfoSection
          description={exercise.description}
          initialMemo={persistedMemo}
          onMemoSave={setPersistedMemo}
        />
      )}
      {activeTab === "나의 기록" && (
        <ExerciseRecordSection
          myStats={myStats as any}
          recentLogs={recentLogs}
        />
      )}
    </div>
  );
};

export default ExerciseDetail;
