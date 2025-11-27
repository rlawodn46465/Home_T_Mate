import { useState, useEffect, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import ExerciseDayGroup from "./ExerciseDayGroup";
import "./ExerciseList.css";

const DUMMY_DATA = [
  // 날짜별로 혼합된 더미 데이터 (서버에서 가져온다고 가정)
  {
    id: 1,
    date: "2025-09-10",
    type: "개별운동",
    name: "런지 (덤벨)",
    category: "하체",
    sets: "10회 3세트",
    duration: "12분",
    completed: true,
  },
  {
    id: 2,
    date: "2025-09-10",
    type: "개별운동",
    name: "스쿼트 (맨몸)",
    category: "하체",
    sets: "30회 3세트",
    duration: "15분",
    completed: true,
  },
  {
    id: 3,
    date: "2025-09-10",
    type: "루틴",
    name: "맨몸 운동 3분할 루틴",
    maker: "나님",
    duration: "185분",
    completed: true,
  },
  {
    id: 4,
    date: "2025-09-10",
    type: "챌린지",
    name: "푸쉬업 100개 만들기",
    maker: "나님",
    duration: "90분",
    completed: false,
  },
  {
    id: 5,
    date: "2025-09-09",
    type: "개별운동",
    name: "벤치 프레스",
    category: "가슴",
    sets: "8회 3세트",
    duration: "30분",
    completed: true,
  },
  // ... 더 많은 데이터
];

//
const transformDataForCard = (backendRecord) => {
  return backendRecord.exercises.map((ex, index) => ({
    id: `${backendRecord.date}-${index}`,
    date: backendRecord.date,
    type: backendRecord.recordType, // 예: 'ROUTINE' -> 매핑 필요할 수 있음
    name: ex.name,
    category: ex.category,
    sets: `${ex.sets.length}세트`, // 세트 수 문자열 변환
    duration: `${Math.floor(ex.totalTime / 60)}분`, // 초 -> 분 변환
    completed: true, // 로직에 따라 변경
    // 필요한 추가 필드 매핑
  }));
};

// 운동 기록 배열을 날짜를 기준으로 그룹화 후 객체 반환
// const groupRecordsByDate = (records) => {
//   if (!Array.isArray(records)) return {};
//   return records.reduce((acc, record) => {
//     const dateKey = record.date;
//     if (dateKey) {
//       if (!acc[dateKey]) acc[dateKey] = [];
//       acc[dateKey].push(record);
//     }
//     return acc;
//   }, {});
// };

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
