import { useEffect, useState } from "react";
import ExerciseInfoSection from "./ExerciseInfoSection";
import { fetchSingleRecord } from "../../../../services/api/historyApi";
import "./ExerciseFormContainer.css";
import { usePersistentPanel } from "../../../../hooks/usePersistentPanel";

const ExerciseFormContainer = ({ recordId }) => {
  const { navigateToPanel } = usePersistentPanel();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!recordId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recordId) {
      const loadRecord = async () => {
        try {
          const data = await fetchSingleRecord(recordId);
          setInitialData(data);
        } catch (err) {
          console.error("기록 로드 실패:", err);
          setError("기록을 불러오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      loadRecord();
    }
  }, [recordId]);

  const handleCancel = () => {
    navigateToPanel("?panel=record");
  };

  if (isLoading) {
    return (
      <div className="loading-message">기록 데이터를 로드 중입니다...</div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // 헤더 제목 변경
  const headerTitle = recordId ? "운동 기록 수정" : "운동 기록 추가";
  const type = initialData?.type || null;

  // 수정 데이터가 있다면 날짜를 Date 객체로 변환
  const initialDate = initialData?.date
    ? new Date(initialData.date)
    : new Date();

  return (
    <div className="exercise-form-container">
      <div className="exercise-form-container__header">
        <h2>{headerTitle}</h2>
        <button className="form-cancel-button" onClick={handleCancel}>
          취소
        </button>
      </div>
      <ExerciseInfoSection
        recordId={recordId}
        initialData={initialData}
        type={type}
        initialDate={initialDate}
      />
    </div>
  );
};

export default ExerciseFormContainer;
