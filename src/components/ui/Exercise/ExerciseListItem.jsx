import { useState } from "react";
import "./ExerciseListItem.css";

const translateType = (type) => {
  switch (type) {
    case "routine":
      return "루틴";
    case "challenge":
      return "챌린지";
    case "single":
      return "운동";
    default:
      return "";
  }
};

const formatDate = (isoString) => {
  const dateObj = new Date(isoString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const formatInitialDetail = (sets) => {
  if (sets && sets.length > 0) {
    const firstSet = sets[0];
    const totalSets = sets.length;
    return `${firstSet.weight}kg ${firstSet.reps}회 ${totalSets}세트`;
  }
  return "기록 없음";
};

const ExerciseListItem = ({ data }) => {
  //토글 기능을 위한 상태
  const [isExpanded, setIsExpanded] = useState(false);
  // 첫번째 세트 정보
  const initialDetail = formatInitialDetail(data.sets);
  // 포캣된 날짜
  const formattedDate = formatDate(data.date);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li
      className={`exercise-list-item ${
        isExpanded ? "exercise-list-item--expanded" : ""
      }`}
      onClick={handleToggle}
    >
      <div className="exercise-list-item__header">
        <h4 className="exercise-list-item__name">{data.sourceName}</h4>
        <p
          className={`exercise-list-item__tag exercise-list-item__tag--${data.type}`}
        >
          {translateType(data.type)}
        </p>
      </div>

      <p className="exercise-list-item__detail-initial">{initialDetail}</p>

      {isExpanded && (
        <div className="exercise-list-item__expanded-content">
          {data.sets.map((set, index) => (
            <p key={index} className="exercise-list-item__set-log">
              Set {set.set}: {set.weight}kg x {set.reps}회
            </p>
          ))}
        </div>
      )}

      <div className="exercise-list-item__right-info">
        <p className="exercise-list-item__time">{data.duration}분</p>
        <p className="exercise-list-item__date">{formattedDate}</p>
      </div>
    </li>
  );
};

export default ExerciseListItem;
