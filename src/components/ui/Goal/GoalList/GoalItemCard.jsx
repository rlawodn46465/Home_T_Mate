import { useState } from "react";

import "./GoalItemCard.css";
import ContextualMenu from "./ContextualMenu";
import { useNavigate } from "react-router-dom";

const GoalItemCard = ({
  goals,
  onAction,
  isDeleting,
  onClickOverride = null,
  hidenMenu = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { goalTypeLabel, name, progress, parts, activeDaysLabel, creator } = goals;
  // 진행도 바
  const progressPercent = (progress * 100).toFixed(0);

  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isDeleting) return;

    if (onClickOverride) {
      onClickOverride(goals);
      return;
    }

    if (!isMenuOpen) {
      navigate(`/?panel=goals-detail&goalId=${goals.id}`);
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
      navigate(`/?panel=goals-form&goalId=${goals.id}&isEditMode=true`);
    } else {
      if (onAction) onAction(goals.id, action);
    }
  };

  return (
    // 삭제중 스타일링 할지 고민할 것
    <div
      className={`goal-card ${isDeleting ? "goal-card--deleting" : ""}`}
      onClick={handleCardClick}
    >
      <div className="goal-card__header">
        <span
          className={`goal-card__type-tag goal-card__type-tag--${goalTypeLabel}`}
        >
          {goalTypeLabel}
        </span>
        <h5 className="goal-card__title">{name}</h5>
        {!hidenMenu && (
          <div className="goal-card__options">
            <button
              className="goal-card__options-btn"
              onClick={handleOptionsClick}
              disabled={isDeleting}
            >
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </button>
            {isMenuOpen && <ContextualMenu onSelect={handleMenuSelect} />}
          </div>
        )}
      </div>
      <div className="goal-card__info">
        <div className="goal-card__info-progress">
          진행도 :
          {goalTypeLabel === "챌린지" ? (
            <div className="goal-card__progress-bar-wrapper">
              <div
                className="goal-card__progress-bar"
                style={{ width: `${progressPercent}%` }}
              ></div>
              <span className="goal-card__progress-label">
                {progressPercent}%
              </span>
            </div>
          ) : (
            <p>{progress}주차</p>
          )}
        </div>
        <p>부위: {parts.join(", ")}</p>
        <div className="goal-card__progress-bottom">
          <p>빈도: {activeDaysLabel}</p>
          <p>제작자: {creator}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalItemCard;
