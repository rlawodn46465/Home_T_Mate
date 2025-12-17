import { useEffect, useState } from "react";
import styles from "./ExerciseFormContainer.module.css";
import ExerciseInfoSection from "./ExerciseInfoSection";
import { fetchSingleRecord } from "../../../../services/api/historyApi";
import { usePersistentPanel } from "../../../../hooks/usePersistentPanel";
import Spinner from "../../../common/Spinner";
import ErrorMessage from "../../../common/ErrorMessage";

const ExerciseFormContainer = ({ recordId }) => {
  const { navigateToPanel } = usePersistentPanel();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!recordId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recordId) return;

    const loadRecord = async () => {
      try {
        const data = await fetchSingleRecord(recordId);
        setInitialData(data);
      } catch (err) {
        setError("기록을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadRecord();
  }, [recordId]);

  if (isLoading) return <Spinner text="데이터를 불러오는 중입니다..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {recordId ? "운동 기록 수정" : "운동 기록 추가"}
        </h2>
        <button
          className={styles.cancelBtn}
          onClick={() => navigateToPanel("?panel=record")}
        >
          취소
        </button>
      </header>

      <ExerciseInfoSection
        recordId={recordId}
        initialData={initialData}
        type={initialData?.type || null}
        initialDate={
          initialData?.date ? new Date(initialData.date) : new Date()
        }
      />
    </div>
  );
};

export default ExerciseFormContainer;
