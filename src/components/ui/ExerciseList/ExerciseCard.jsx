import { useEffect, useState } from "react";
import "./ExerciseCard.css";
import DotsMenuToggle from "../../common/DotsMenuToggle";
import DropdownMenu from "../../common/DropdownMenu";

const ExerciseCard = ({ record }) => {
  const { type, name, category, sets, duration, completed, maker } = record;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 콘솔 테스트
  useEffect(() => {
    // console.log(record);
  }, []);

  // 메뉴 토글
  const handleMenuItemClick = (action) => {
    if (action === "삭제") {
      console.log("삭제");
    }
    console.log(`${action} 버튼이 클릭되었습니다.`);
    setIsMenuOpen(false);
  };

  const handleToggle = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsMenuOpen((prev) => !prev);
  };

 
  return (
    <div
      className={`exercise-card card-${type.toLowerCase()} ${
        completed ? "is-completed" : ""
      }`}
    >
      {/* 타입 */}
      {type === "개별운동" ? <></> : <div>ㅇㅇ</div>}
      <div className="card-header">
        <h4 className="card-name">{name}</h4>
        <div className="card-toggle">
          <DotsMenuToggle onClick={handleToggle} isActive={isMenuOpen} />
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
