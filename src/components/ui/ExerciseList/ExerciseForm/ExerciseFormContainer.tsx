import styles from "./ExerciseFormContainer.module.css";
import ExerciseInfoSection from "./ExerciseInfoSection";
import { usePersistentPanel } from "../../../../hooks/usePersistentPanel";
import Spinner from "../../../common/Spinner";
import ErrorMessage from "../../../common/ErrorMessage";
import { useSingleHistory } from "../../../../hooks/useHistory";

interface ExerciseFormContainerProps {
  recordId?: string;
}

const ExerciseFormContainer = ({ recordId }: ExerciseFormContainerProps) => {
  const { navigateToPanel } = usePersistentPanel();
  const { record, isLoading, error } = useSingleHistory(recordId);

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
        initialData={record}
        type={record?.type || null}
        initialDate={record?.date ? new Date(record.date) : new Date()}
      />
    </div>
  );
};

export default ExerciseFormContainer;
