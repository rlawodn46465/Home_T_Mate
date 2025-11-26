export const transformHistoryToFlatList = (serverData) => {
  if(!serverData || !Array.isArray(serverData)) return [];

  const flatList = [];

  serverData.forEach((historyItem) => {
    const {exerciseId, records} = historyItem;
    // populate된 exerciseInfo가 있다고 가정하거나, records 안에 정보가 있다면 사용
    // 현재 서버 로직상 getWorkout은 populate가 안되어 보입니다. 
    // *주의: 서버 getWorkoutSession 컨트롤러에서 .populate('exerciseId')가 필요할 수 있습니다.
    // 여기서는 일단 records 데이터를 기반으로 처리합니다.

    if(records && Array.isArray(records)) {
      records.forEach((record) => {
        flatList.push({
          id: record._id || `${exerciseId}-${record.date}`, // 고유키 생성
          date: record.date.split("T")[0], // YYYY-MM-DD
          type: record.recordType === "PERSONAL" ? "개별운동" : 
                record.recordType === "CHALLENGE" ? "챌린지" : "루틴",
          name: record.goalName || "운동", // 혹은 exerciseId.name (populate 필요)
          category: "기타", // exerciseId 정보 필요
          sets: `${record.sets.length}세트`,
          duration: `${Math.round((record.totalTime || 0) / 60)}분`,
          completed: true,
          // 원본 데이터 보존
          originalRecord: record
        });
      });
    }
  });

  // 최신순 정렬
  return flatList.sort((a, b) => new Date(b.date) - new Date(a.date));
}