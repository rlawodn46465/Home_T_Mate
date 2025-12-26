import { useMemo } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import styles from "./ExerciseList.module.css";
import ExerciseDayGroup from "./ExerciseDayGroup";
import { RECORD_TYPE } from "../../../utils/recordType";
import type { DailyRecord } from "../../../types/goal";
import type { ExerciseRecord } from "../../common/ExerciseCard";

interface ExerciseListProps {
  activeTab: string; // "전체" | "개별운동" | "루틴" | "챌린지"
  selectedDate: Date;
  monthlyData?: DailyRecord[];
  onEdit?: (record: ExerciseRecord) => void;
  onDelete?: (id: string) => void;
}

const transformDataForCard = (backendRecord: any): ExerciseRecord[] => {
  if (!backendRecord.exercises || !Array.isArray(backendRecord.exercises))
    return [];

  return backendRecord.exercises.map((ex: any) => ({
    id: ex.id,
    exerciseId: ex.exerciseId,
    date: backendRecord.date,
    type: backendRecord.recordType,
    name: ex.name,
    category: ex.targetMuscles || [],
    sets: ex.sets || [],
    duration: ex.totalTime || 0,
    completed: true,
  }));
};

const ExerciseList = ({
  activeTab,
  selectedDate,
  monthlyData = [],
  onEdit,
  onDelete,
}: ExerciseListProps) => {
  // 선택된 날짜 및 탭에 따른 필터링 로직
  const displayData = useMemo(() => {
    if (!selectedDate || monthlyData.length === 0) return [];

    // 날짜 필터링
    const targetDayRecords = monthlyData.filter((data) =>
      isSameDay(parseISO(data.date), selectedDate)
    );

    if (targetDayRecords.length === 0) return [];

    // 데이터 평탄화 (FlatMap)
    const allExercises = targetDayRecords.flatMap(transformDataForCard);

    // 탭 카테고리 필터링
    if (activeTab === "전체") return allExercises;

    const tabTypeMap: Record<string, string> = {
      개별운동: RECORD_TYPE.PERSONAL,
      루틴: RECORD_TYPE.ROUTINE,
      챌린지: RECORD_TYPE.CHALLENGE,
    };

    return allExercises.filter(
      (record) => record.type === tabTypeMap[activeTab]
    );
  }, [selectedDate, monthlyData, activeTab]);

  const isDateExists = useMemo(
    () => monthlyData.some((d) => isSameDay(parseISO(d.date), selectedDate)),
    [monthlyData, selectedDate]
  );

  if (!isDateExists) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <span className={styles.highlight}>
            {format(selectedDate, "M월 d일")}
          </span>
          은 운동 기록이 없는 날입니다. <br />
          오늘의 운동을 시작해보세요!
        </div>
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          {format(selectedDate, "M월 d일")}에 해당{" "}
          <span className={styles.highlight}>[{activeTab}]</span> 기록이
          없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ExerciseDayGroup
        date={format(selectedDate, "yyyy-MM-dd")}
        records={displayData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default ExerciseList;
