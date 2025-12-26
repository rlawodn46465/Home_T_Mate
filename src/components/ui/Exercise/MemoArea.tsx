import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./MemoArea.module.css";

interface MemoAreaProps {
  initialMemo: string;
  onSave?: (memo: string) => void;
}

const MemoArea = ({ initialMemo, onSave }: MemoAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentMemo, setCurrentMemo] = useState<string>(initialMemo);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [editingStartData, setEditingStartData] = useState<string>(initialMemo);

  useEffect(() => {
    setCurrentMemo(initialMemo);
    setEditingStartData(initialMemo);
    setIsChanged(false);
  }, [initialMemo]);

  const handleStartEdit = () => {
    if (!isEditing) {
      setEditingStartData(currentMemo);
      setIsEditing(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleMemoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
            onMouseDown={(e) => {
              e.preventDefault();
              handleCancel();
            }}
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
