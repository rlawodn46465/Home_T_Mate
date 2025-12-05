import "./ExerciseRecordSection.css";
import ExerciseCard from "../../common/ExerciseCard";

// "분 초" 단위로 변환
const formatDuration = (seconds) => {
  if (typeof seconds !== "number" || seconds < 0) {
    return "0.0";
  }

  const minutes = seconds / 60;

  return minutes.toFixed(1);
};

const ExerciseRecordSection = ({ myStats, recentLogs }) => {
  return (
    <div className="exercise-record-section">
      <h4>최고 기록</h4>
      <ul className="exercise-record-section__stats-list">
        <li>
          <div>
            {myStats.best.weight ? myStats.best.weight : "- "}
            <span> kg</span>
          </div>
          <p>최고 무게</p>
        </li>
        <li>
          <div>
            {myStats.total.reps ? myStats.total.reps : "- "}
            <span> 회</span>
          </div>
          <p>총 횟수</p>
        </li>
        <li>
          <div>
            {myStats.best.volume ? myStats.best.volume : "- "}
            <span> kg</span>
          </div>
          <p>최고 볼륨</p>
        </li>
        <li>
          <div>
            {myStats.total.time ? formatDuration(myStats.total.time) : "- "}
            <span> 분</span>
          </div>
          <p>총 시간</p>
        </li>
      </ul>
      <h4>최근 기록</h4>
      <ul className="exercise-record-section__recent-logs">
        {recentLogs.map((data, index) => (
          <ExerciseCard key={index} record={data} isMenuSelector={false} isDetailSelector={false}/>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseRecordSection;
