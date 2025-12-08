import { useMemo } from "react";
import { format, isSameDay } from "date-fns";
import ExerciseDayGroup from "./ExerciseDayGroup";
import { RECORD_TYPE } from "../../../utils/recordType";
import "./ExerciseList.css";

//
const transformDataForCard = (backendRecord) => {
  return backendRecord.exercises.map((ex) => ({
    id: ex.id,
    exerciseId: ex.exerciseId,
    date: backendRecord.date,
    type: backendRecord.recordType,
    name: ex.name,
    category: ex.targetMuscles,
    sets: ex.sets,
    duration: ex.totalTime,
    completed: true,
  }));
};

const ExerciseList = ({
  activeTab,
  selectedDate,
  monthlyData = [],
  onEdit,
  onDelete,
}) => {
  // 선택된 날짜와 탭에 따라 데이터 필터
  const displayData = useMemo(() => {
    if (!selectedDate || monthlyData.length === 0) return [];

    // 선택된 날짜의 데이터 찾기
    const targetDayRecords = monthlyData.filter((data) =>
      isSameDay(new Date(data.date), selectedDate)
    );

    if (targetDayRecords.length === 0) return [];

    const allExercises = targetDayRecords.flatMap(transformDataForCard);

    // 탭(카테고리) 필터링
    if (activeTab === "전체") return allExercises;

    return allExercises.filter((record) => {
      switch (activeTab) {
        case "개별운동":
          return record.type === RECORD_TYPE.PERSONAL;
        case "루틴":
          return record.type === RECORD_TYPE.ROUTINE;
        case "챌린지":
          return record.type === RECORD_TYPE.CHALLENGE;
        default:
          return true;
      }
    });
  }, [selectedDate, monthlyData, activeTab]);

  if (monthlyData.length > 0 && displayData.length === 0) {
    return (
      <div className="exercise-list">
        <div
          className="no-data"
          style={{ padding: "20px", textAlign: "center", color: "#888" }}
        >
          {format(selectedDate, "M월 d일")}에 해당 운동 기록이 없습니다.
        </div>
      </div>
    );
  }

  // 데이터가 아예 없는 경우 (그 날 운동 안 함)
  if (
    monthlyData.length > 0 &&
    !monthlyData.find((d) => isSameDay(new Date(d.date), selectedDate))
  ) {
    return (
      <div className="exercise-list">
        <div
          className="no-data"
          style={{ padding: "20px", textAlign: "center", color: "#888" }}
        >
          운동 기록이 없는 날입니다. <br />
          운동을 추가해보세요!
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-list">
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
