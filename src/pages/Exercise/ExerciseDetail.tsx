import { useEffect, useState } from "react";
import MuscleMap from "../../components/common/MuscleMap";
import TabNavigation from "../../components/common/TabNavigation";
import ExerciseInfoSection from "../../components/ui/Exercise/ExerciseInfoSection";
import ExerciseRecordSection from "../../components/ui/Exercise/ExerciseRecordSection";
import { fetchExerciseDetail } from "../../services/api/goalApi";
import PageHeader from "../../components/common/PageHeader";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

import styles from "./ExerciseDetail.module.css";

interface ExerciseDescription {
  setup: { step: number; text: string }[];
  movement: { step: number; text: string }[];
  breathing: { step: number; text: string }[];
  tips: string[];
}

interface ExerciseStats {
  memo?: string;
  best: number;
  total: number;
  [key: string]: any;
}

interface ExerciseDetailData {
  exercise: {
    id?: string | number;
    name: string;
    description: ExerciseDescription;
    targetMuscles: string[];
    equipment: string;
  };
  myStats?: ExerciseStats;
  recentLogs?: any[];
}

interface ExerciseDetailProps {
  exerciseId: string | number;
}

type TabType = (typeof TABS)[number];

const TABS = ["설명", "나의 기록"] as const;

const ExerciseDetail = ({ exerciseId }: ExerciseDetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(TABS[0]);

  // API 데이터 및 로딩/에러 상태 관리
  const [detailData, setDetailData] = useState<ExerciseDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 메모 상태
  const [persistedMemo, setPersistedMemo] = useState<string>("");

  const { navigateToPanel } = usePersistentPanel();

  useEffect(() => {
    if (!exerciseId) {
      setError("유효한 운동 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    // 운동 상세 정보 비동기 로드
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchExerciseDetail(String(exerciseId));

        if (!isCancelled) {
          setDetailData(data as unknown as ExerciseDetailData);
          // 기존 메모 데이터가 있다면 상태 업데이트
          if (data.myStats?.memo) {
            setPersistedMemo(data.myStats.memo);
          }
        }
      } catch (err) {
        console.error("상세 정보 로드 실패:", err);
        if (!isCancelled) {
          setError("정보를 불러오는데 실패했습니다.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadData();

    // 언마운트 시 비동기 작업 취소 처리
    return () => {
      isCancelled = true;
    };
  }, [exerciseId]);

  // 메모 저장 처리
  const handleMemoSave = (newMemo: string) => {
    setPersistedMemo(newMemo);
    console.log("메모 저장 완료 : ", newMemo);
  };

  // 기록 목록으로 돌아가기
  const handleGoBackToRecordList = () => {
    navigateToPanel("?panel=record");
  };

  // 상태별 렌더링 (로딩, 에러, 데이터 없음)
  if (isLoading)
    return <Spinner text={"🏃‍♂️ 운동 상세 정보를 불러오는 중입니다..."} />;
  if (error) return <ErrorMessage message={`❌ 오류: ${error}`} />;
  if (!detailData)
    return <div className={styles.errorState}>데이터가 존재하지 않습니다.</div>;

  return (
    <div className={styles.exerciseDetailPage}>
      <PageHeader
        title={"운동 기록 상세"}
        onGoBack={handleGoBackToRecordList}
      />
      <div className={styles.exerciseHeader}>
        {detailData.exercise.targetMuscles && (
          <MuscleMap selectedTags={detailData.exercise.targetMuscles} />
        )}
        <div className={styles.exerciseHeaderInfo}>
          <h4 className={styles.exerciseName}>{detailData.exercise.name}</h4>
          <p className={styles.exerciseMeta}>
            부위 : {detailData.exercise.targetMuscles.join(", ")}
          </p>
          <p className={styles.exerciseMeta}>
            장비 : {detailData.exercise.equipment}
          </p>
        </div>
      </div>
      <TabNavigation
        tabs={TABS as unknown as string[]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
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
          myStats={detailData.myStats as any}
          recentLogs={detailData.recentLogs}
        />
      )}
    </div>
  );
};

export default ExerciseDetail;
