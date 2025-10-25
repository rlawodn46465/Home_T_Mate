import { useEffect, useRef, useState } from "react";
import "./MemoArea.css";

const MemoArea = ({ initialMemo, onSave }) => {
  const textareaRef = useRef(null);
  const [currentMemo, setCurrentMemo] = useState(initialMemo);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setCurrentMemo(initialMemo);
    setIsChanged(false);
  }, [initialMemo]);

  const handleContainerClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleMemoChange = (e) => {
    console.log(initialMemo);
    setCurrentMemo(e.target.value);
    setIsChanged(e.target.value !== initialMemo);
  };

  const handleBlur = () => {
    console.log('블러됨');
    setTimeout(() => {
      if (isEditing) {
        setIsEditing(false);
      }
      if (isChanged && onSave) {
        onSave(currentMemo);
      }
      setIsChanged(false);
    }, 0);
  };

  const handleCancel = () => {
    console.log('편집 취소 누름');
    console.log(initialMemo);
    onSave(initialMemo);
    setCurrentMemo(initialMemo);
    setIsEditing(false);
    setIsChanged(false);

    // if(textareaRef.current){
    //   textareaRef.current.blur();
    // }
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="memo-area-secion">
      <h4>메모</h4>
      <div onClick={handleContainerClick}>
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

      {(isEditing || isChanged) && (
        <div>
          {isEditing && <button onMouseDown={handleCancel}>편집 취소</button>}
        </div>
      )}
    </div>
  );
};

export default MemoArea;
