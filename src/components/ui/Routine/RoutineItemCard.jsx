import { useState } from "react";

import "./RoutineItemCard.css";
import ContextualMenu from "./ContextualMenu";
import { useNavigate } from "react-router-dom";

const RoutineItemCard = ({ routine, onAction }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { routineType, name, progress, parts, activeDays} = routine;

  // 진행도 바
  // const progressPercent = (progress * 100).toFixed(0);
  const progressPercent = (0.7 * 100).toFixed(0);

  const navigate = useNavigate();
  const handleCardClick = () => {
    if (!isMenuOpen) {
      navigate(`/?panel=routine-detail&routineId=${routine.id}`);
    }
  };

  const handleOptionsClick = (event) => {
    event.stopPropagation(); // 카드 클릭 이벤트가 부모로 전파되는 것을 막습니다.
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="routine-card" onClick={handleCardClick}>
      <div className="routine-card__header">
        <span
          className={`routine-card__type-tag routine-card__type-tag--${routineType.toLowerCase()}`}
        >
          {routineType}
        </span>
        <h5 className="routine-card__title">{name}</h5>
        <div className="routine-card__options">
          <button
            className="routine-card__options-btn"
            // onClick={() => setIsMenuOpen(!isMenuOpen)}
            onClick={handleOptionsClick}
          >
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </button>

          {isMenuOpen && (
            <ContextualMenu
              onSelect={(action) => {
                onAction(routine.id, action);
                setIsMenuOpen(false);
              }}
            />
          )}
        </div>
      </div>
      <div className="routine-card__info">
        <div className="routine-card__info-progress">
          진행도 :
          {routineType === "Challenge" ? (
            <div className="routine-card__progress-bar-wrapper">
              <div
                className="routine-card__progress-bar"
                style={{ width: `${progressPercent}%` }}
              ></div>
              <span className="routine-card__progress-label">
                {0.5}%
              </span>
            </div>
          ) : (
            <p>{progress.value}주차</p>
          )}
        </div>
        <p>부위: {parts.join(", ")}</p>
        <div className="routine-card__progress-bottom">
          <p>빈도: {activeDays}</p>
          <p>제작자: {"나님"}</p>
        </div>
      </div>
    </div>
  );
};

export default RoutineItemCard;
