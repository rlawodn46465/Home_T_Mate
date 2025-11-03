import { useEffect, useRef, useState } from "react";
import "./MemoArea.css";

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

  const handleContainerClick = () => {
    if (!isEditing) {
      setEditingStartData(currentMemo);
      setIsEditing(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleMemoChange = (e) => {
    const newValue = e.target.value;
    setCurrentMemo(newValue);
    setIsChanged(newValue !== editingStartData);
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setCurrentMemo(editingStartData);
    setIsEditing(false);
    setIsChanged(false);

    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleSave = () => {
    if (isChanged && onSave) {
      onSave(currentMemo);
      setIsEditing(false);
      textareaRef.current?.blur();
    }
  };

  return (
    <div className="memo-area-secion">
      <h4>메모</h4>
      <div onMouseDown={handleContainerClick}>
        <textarea
          ref={textareaRef}
          value={currentMemo}
          onChange={handleMemoChange}
          onBlur={handleBlur}
          readOnly={!isEditing}
          rows={5}
          className={`memo-area ${isEditing ? "focus" : ""}`}
          placeholder={initialMemo}
        />
      </div>

      {isEditing && <button onMouseDown={handleCancel}>편집 취소</button>}
      {isEditing && (
        <button onClick={handleSave} disabled={!isChanged}>
          저장
        </button>
      )}
    </div>
  );
};

export default MemoArea;
