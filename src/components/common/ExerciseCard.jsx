import { useState } from "react";
import "./ExerciseCard.css";
import DotsMenuToggle from "./DotsMenuToggle";
import DropdownMenu from "./DropdownMenu";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";

// "분 초" 단위로 변환
const formatDuration = (seconds) => {
  if (typeof seconds !== "number" || seconds < 0) return "0초";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (seconds === 0) {
    return "0초";
  }

  if (minutes > 0) {
    if (remainingSeconds === 0) {
      return `${minutes}분`;
    }
    return `${minutes}분 ${remainingSeconds}초`;
  }
  return `${remainingSeconds}초`;
};

const ExerciseCard = ({
  record,
  isMenuSelector = true,
  isDetailSelector = true,
  onEdit,
  onDelete,
}) => {
  const { navigateToPanel, currentPath } = usePersistentPanel();
  const exerciseId = record.exerciseId;
  const recordId = record.id;

  const { type, name, category, completed, sets } = record;
  const durationSeconds = record.duration;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 시간 변환
  const formattedDuration = formatDuration(durationSeconds);

  // 카테고리 변환 로직
  const formattedCategory = Array.isArray(category)
    ? category.join(", ")
    : category;

  // 메뉴 토글
  const handleMenuItemClick = (action) => {
    setIsMenuOpen(false);

    if (recordId) {
      if (action === "수정" && typeof onEdit === "function") {
        onEdit(record);
      } else if (action === "삭제" && typeof onDelete === "function") {
        if (window.confirm(`정말로 '${name}' 운동 기록을 삭제하시겠습니까?}`)) {
          onDelete(recordId);
        }
      }
    } else {
      console.error("기록 ID가 없어 수정/삭제를 처리할 수 없습니다.", record);
    }
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

    if (isDetailSelector) {
      // 상세 페이지로 이동
      if (exerciseId) {
        const newQuery = `?panel=exercise-detail&exerciseId=${exerciseId}`;
        navigateToPanel(newQuery, currentPath);
      } else {
        console.error(
          "운동 ID가 없어 상세 페이지로 이동할 수 없습니다.",
          record
        );
      }
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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuItemClick("수정");
                }}
              >
                수정
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuItemClick("삭제");
                }}
              >
                삭제
              </div>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="card-meta">
        <div className="card-info-container">
          <p className="card-category">{formattedCategory}</p>
          {sets.map((st, index) => (
            <div key={`${st}${index}`}>{`${st.weight}kg ${st.reps}회`}</div>
          ))}
        </div>
        <div className="card-time-container">
          <p className="card-time">{formattedDuration}</p>
          <p className="card-date-time">{record.date}</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
