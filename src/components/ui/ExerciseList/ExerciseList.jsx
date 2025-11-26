import { useEffect, useState } from "react";
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

// 운동 기록 배열을 날짜를 기준으로 그룹화 후 객체 반환
const groupRecordsByDate = (records) => {
  if (!Array.isArray(records)) return {};
  return records.reduce((acc, record) => {
    const dateKey = record.date;
    if (dateKey) {
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(record);
    }
    return acc;
  }, {});
};

const ExerciseList = ({ activeTab }) => {
  const [exerciseRecords, setExerciseRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // let filteredData = DUMMY_DATA;
    const loadData = async () => {
      try {
        setIsLoading(true);
        // const response = await fetchExerciseHistory();
        // if (response.success) {
        //   const flatData = transformHistoryToFlatList(response.data);
        //   setAllRecords(flatData);
        // }
      } catch (error) {
        console.error("운동 기록 로딩 실패: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "전체") {
      setExerciseRecords(allRecords);
    } else {
      setExerciseRecords(
        allRecords.filter((record) => record.type === activeTab)
      );
    }
  }, [activeTab, allRecords]);

  // 렌더링 준비
  const groupedRecords = groupRecordsByDate(exerciseRecords);
  const dates = Object.keys(groupedRecords).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  if (isLoading) return <div className="loading">데이터를 불러오는 중...</div>;

  if (exerciseRecords.length === 0) {
    return (
      <div className="no-data">선택한 탭에 해당하는 운동 기록이 없습니다.</div>
    );
  }

  //   if (activeTab === "개별운동") {
  //     filteredData = DUMMY_DATA.filter((record) => record.type === "개별운동");
  //   } else if (activeTab === "루틴") {
  //     filteredData = DUMMY_DATA.filter((record) => record.type === "루틴");
  //   } else if (activeTab === "챌린지") {
  //     filteredData = DUMMY_DATA.filter((record) => record.type === "챌린지");
  //   }

  //   setExerciseRecords(filteredData);
  // }, [activeTab]);

  return (
    <div className="exercise-list">
      {dates.map((date) => (
        <ExerciseDayGroup
          key={date}
          date={date}
          records={groupedRecords[date]}
        />
      ))}
    </div>
  );
};

export default ExerciseList;
