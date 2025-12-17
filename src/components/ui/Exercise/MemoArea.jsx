import { useEffect, useRef, useState } from "react";
import styles from "./MemoArea.module.css";

const MemoArea = ({ initialMemo, onSave }) => {
  const textareaRef = useRef(null);
  const [currentMemo, setCurrentMemo] = useState(initialMemo);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [editingStartData, setEditingStartData] = useState(initialMemo);

  useEffect(() => {
    setCurrentMemo(initialMemo);
    setEditingStartData(initialMemo);
    setIsChanged(false);
  }, [initialMemo]);

  const handleStartEdit = () => {
    if (!isEditing) {
      setEditingStartData(currentMemo);
      setIsEditing(true);
      textareaRef.current?.focus();
    }
  };

  const handleMemoChange = (e) => {
    const newValue = e.target.value;
    setCurrentMemo(newValue);
    setIsChanged(newValue !== editingStartData);
  };

  const handleCancel = () => {
    setCurrentMemo(editingStartData);
    setIsEditing(false);
    setIsChanged(false);
  };

  const handleSave = () => {
    if (isChanged && onSave) {
      onSave(currentMemo);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.section}>
      <h4>메모</h4>
      <div className={styles.textareaContainer} onMouseDown={handleStartEdit}>
        <textarea
          ref={textareaRef}
          className={`${styles.textarea} ${isEditing ? styles.editing : ""}`}
          value={currentMemo}
          onChange={handleMemoChange}
          readOnly={!isEditing}
          placeholder="여기에 메모를 남겨보세요..."
          rows={5}
        />
      </div>

      {isEditing && (
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.btn} ${styles.cancelBtn}`}
            onMouseDown={handleCancel}
          >
            편집 취소
          </button>
          <button
            className={`${styles.btn} ${styles.saveBtn}`}
            onClick={handleSave}
            disabled={!isChanged}
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoArea;
