import { useState } from "react";
import edit_icon from "../../../../assets/images/edit_icon.svg";
import "./RoutineNameInput.css";

const RoutineNameInput = ({ initialName, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentName, setCurrentName] = useState(initialName || "새 루틴 이름");

  // 아이콘 클릭 시 수정 모드 전환
  const handleEditClick = () => setIsEditing(true);

  // 입력 필드값 변경 핸들러
  const handleInputChange = (e) => setCurrentName(e.target.value);

  // 확인 버튼 클릭 시 수정 완료
  const handleSaveClick = () => {
    if (currentName.trim()) {
      onNameChange(currentName.trim());
      setIsEditing(false);
    }
  };

  // Enter 키 입력 감지
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveClick();
    }
  };

  return (
    <div>
      {isEditing ? (
        <div className="routine-name-input">
          <input
            type="text"
            className="routine-name-input__text-input"
            value={currentName}
            onChange={handleInputChange}
            onBlur={handleSaveClick}
            onKeyDown={handleKeyDown}
            placeholder="이름을 입력하세요."
            autoFocus
          />
          <img
            className="routine-name-input__icon"
            onClick={handleSaveClick}
            src={edit_icon}
            alt="수정"
          />
        </div>
      ) : (
        <div className="routine-name-input">
          <p className="routine-name-input__text">{currentName}</p>
          <img
            className="routine-name-input__icon"
            onClick={handleEditClick}
            src={edit_icon}
            alt="수정"
          />
        </div>
      )}
    </div>
  );
};

export default RoutineNameInput;
