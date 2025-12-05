import { useState } from "react";
import "./ExerciseCard.css";
import DotsMenuToggle from "./DotsMenuToggle";
import DropdownMenu from "./DropdownMenu";
import { useNavigate } from "react-router-dom";

const ExerciseCard = ({ record, isMenuSelector = true }) => {
  const navigate = useNavigate();
  const exerciseId = record.exerciseId;

  const { type, name, category, duration, completed, sets } = record;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메뉴 토글
  const handleMenuItemClick = (action) => {
    if (action === "삭제") {
      console.log("삭제");
    }
    setIsMenuOpen(false);
  };

  const handleToggle = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsMenuOpen((prev) => !prev);
  };
  const handleCardClick = (e) => {
    if (isMenuOpen) return;
    if (e.target.closest(".card-toggle")) return;

    // 상세 페이지로 이동
    if (exerciseId) {
      navigate(`?panel=exercise-detail&exerciseId=${exerciseId}`);
    } else {
      console.error("운동 ID가 없어 상세 페이지로 이동할 수 없습니다.", record);
    }
  };

  return (
    <div
      className={`exercise-card card-${type.toLowerCase()} ${
        completed ? "is-completed" : ""
      }`}
      onClick={handleCardClick}
    >
      {/* 타입 */}
      {type === "개별운동" ? (
        <></>
      ) : (
        <div className={`card-type-box card-type-${type}`}>{type}</div>
      )}
      <div className="card-header">
        <h4 className="card-name">{name}</h4>
        <div className="card-toggle">
          {isMenuSelector && (
            <DotsMenuToggle onClick={handleToggle} isActive={isMenuOpen} />
          )}
          {isMenuOpen && (
            <DropdownMenu position="right">
              <div onClick={() => handleMenuItemClick("시작")}>시작</div>
              <div onClick={() => handleMenuItemClick("수정")}>수정</div>
              <div onClick={() => handleMenuItemClick("삭제")}>삭제</div>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="card-meta">
        <div className="card-info-container">
          <p className="card-category">{category}</p>
          {sets.map((st, index) => (
            <div key={`${st}${index}`}>{`${st.weight}kg ${st.reps}회`}</div>
          ))}
        </div>
        <div className="card-time-container">
          <p className="card-time">{duration}</p>
          <p className="card-date-time">{record.date}</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
