import { useState } from "react";

import "./RoutineItemCard.css";
import ContextualMenu from "./ContextualMenu";

const RoutineItemCard = ({ routine, onAction }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { type, title, week, parts, freq, creator, progress } = routine;

  const progressPercent = (progress * 100).toFixed(0);

  return (
    <div className="routine-card">
      <div className="routine-card__header">
        <span
          className={`routine-card__type-tag routine-card__type-tag--${type.toLowerCase()}`}
        >
          {type}
        </span>
        <h5 className="routine-card__title">{title}</h5>
        <div className="routine-card__options">
          <button
            className="routine-card__options-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            <p>{week}주차</p>
          )}
        </div>
        <p>부위: {parts.join(", ")}</p>
        <div className="routine-card__progress-bottom">
          <p>빈도: {freq}</p>
          <p>제작자: {creator}</p>
        </div>
      </div>
    </div>
  );
};

export default RoutineItemCard;
