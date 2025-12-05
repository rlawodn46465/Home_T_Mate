import { useState, useEffect, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import ExerciseDayGroup from "./ExerciseDayGroup";
import "./ExerciseList.css";

//
const transformDataForCard = (backendRecord) => {
  return backendRecord.exercises.map((ex, index) => ({
    id: `${backendRecord.id}${index}`,
    exerciseId: ex.exerciseId,
    date: backendRecord.date,
    type: backendRecord.recordType, // 예: 'ROUTINE' -> 매핑 필요할 수 있음
    name: ex.name,
    category: ex.targetMuscles,
    sets: ex.sets, // 세트 수 문자열 변환
    duration: ex.totalTime,
    completed: true, // 로직에 따라 변경
    // 필요한 추가 필드 매핑
  }));
};

const ExerciseList = ({ activeTab, selectedDate, monthlyData = [] }) => {
  const [displayData, setDisplayData] = useState([]);

  // 선택된 날짜와 탭에 따라 데이터 필터
  const filteredRecords = useMemo(() => {
    if (!selectedDate || monthlyData.length === 0) return [];

    // 선택된 날짜의 데이터 찾기
    const targetDayData = monthlyData.find((data) =>
      isSameDay(new Date(data.date), selectedDate)
    );

    if (!targetDayData) return [];
    const transformedList = transformDataForCard(targetDayData);
    // 탭(카테고리) 필터링
    if (activeTab === "전체") return transformedList;

    return transformedList.filter((record) => {
      if (activeTab === "개별운동")
        return record.type === "PERSONAL" || record.type === "개별운동";
      if (activeTab === "루틴")
        return record.type === "ROUTINE" || record.type === "루틴";
      if (activeTab === "챌린지")
        return record.type === "CHALLENGE" || record.type === "챌린지";
      return true;
    });
  }, [selectedDate, monthlyData, activeTab]);

  useEffect(() => {
    setDisplayData(filteredRecords);
  }, [filteredRecords]);

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
      />
    </div>
  );
};

export default ExerciseList;
