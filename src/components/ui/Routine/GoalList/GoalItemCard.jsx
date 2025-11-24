import { useState } from "react";

import "./GoalItemCard.css";
import ContextualMenu from "./ContextualMenu";
import { useNavigate } from "react-router-dom";

const GoalItemCard = ({ routine, onAction, isDeleting }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { type, name, progress, parts, activeDays, status, creator } =
    routine;

  // 진행도 바
  const progressPercent = (progress * 100).toFixed(0);
  
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!isMenuOpen && !isDeleting) {
      navigate(`/?panel=routine-detail&routineId=${routine.id}`);
    }
  };

  const handleOptionsClick = (event) => {
    event.stopPropagation(); // 카드 클릭 이벤트가 부모로 전파되는 것을 막습니다.
    if (isDeleting) return;
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuSelect = (action) => {
    setIsMenuOpen(false);

    if (action === "수정") {
      navigate(`/?panel=routine-form&routineId=${routine.id}&isEditMode=true`);
    } else {
      onAction(routine.id, action);
    }
  };

  return (
    // 삭제중 스타일링 할지 고민할 것
    <div
      className={`routine-card ${isDeleting ? "routine-card--deleting" : ""}`}
      onClick={handleCardClick}
    >
      <div className="routine-card__header">
        <span
          className={`routine-card__type-tag routine-card__type-tag--${type.toLowerCase()}`}
        >
          {type}
        </span>
        <h5 className="routine-card__title">{name}</h5>
        <div className="routine-card__options">
          <button
            className="routine-card__options-btn"
            // onClick={() => setIsMenuOpen(!isMenuOpen)}
            onClick={handleOptionsClick}
            disabled={isDeleting}
          >
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </button>

          {isMenuOpen && <ContextualMenu onSelect={handleMenuSelect} />}
        </div>
      </div>
      <div className="routine-card__info">
        <div className="routine-card__info-progress">
          진행도 :
          {type === "챌린지" ? (
            <div className="routine-card__progress-bar-wrapper">
              <div
                className="routine-card__progress-bar"
                style={{ width: `${progressPercent}%` }}
              ></div>
              <span className="routine-card__progress-label">
                {progressPercent}%
              </span>
            </div>
          ) : (
            <p>{progress}주차</p>
          )}
        </div>
        <p>부위: {parts.join(", ")}</p>
        <div className="routine-card__progress-bottom">
          <p>빈도: {activeDays}</p>
          <p>제작자: {creator}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalItemCard;
