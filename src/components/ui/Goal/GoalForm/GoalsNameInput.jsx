import { useEffect, useState } from "react";
import edit_icon from "../../../../assets/images/edit_icon.svg";
import styles from "./GoalsNameInput.module.css";

const GoalsNameInput = ({ initialName, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentName, setCurrentName] = useState(initialName || "새 목표 이름");

  useEffect(() => {
    if (initialName) {
      setCurrentName(initialName);
    }
  }, [initialName]);

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
        <div className={styles.goalNameInput}>
          <input
            type="text"
            className={styles.textInput}
            value={currentName}
            onChange={handleInputChange}
            onBlur={handleSaveClick}
            onKeyDown={handleKeyDown}
            placeholder="이름을 입력하세요."
            autoFocus
          />
          <img
            className={styles.icon}
            onClick={handleSaveClick}
            src={edit_icon}
            alt="저장"
          />
        </div>
      ) : (
        <div className={styles.goalNameInput}>
          <p className={styles.text}>{currentName}</p>
          <img
            className={styles.icon}
            onClick={handleEditClick}
            src={edit_icon}
            alt="수정"
          />
        </div>
      )}
    </div>
  );
};

export default GoalsNameInput;
