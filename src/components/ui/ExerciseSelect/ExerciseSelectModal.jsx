import React, { useMemo, useState } from "react";
import styles from "./ExerciseSelectModal.module.css";
import { useExercises } from "../../../hooks/useExercises";
import { useDragScroll } from "../../../hooks/useDragScroll";
import MuscleMap from "../../common/MuscleMap";
import Spinner from "../../common/Spinner";

const MUSCLE_PARTS = [
  "전체",
  "가슴",
  "어깨",
  "삼두",
  "이두",
  "전완",
  "복근",
  "승모",
  "대퇴사두",
  "종아리",
];
const TOOLS = ["전체", "맨몸", "덤벨", "바벨", "벤치"];

const ExerciseSelectModal = ({ onClose, onSelect }) => {
  const [selectedPart, setSelectedPart] = useState("전체");
  const [selectedTool, setSelectedTool] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);

  const {
    scrollRef: partRef,
    dragHandlers: partHandlers,
    handleTabClick: onPartClick,
  } = useDragScroll();
  const {
    scrollRef: toolRef,
    dragHandlers: toolHandlers,
    handleTabClick: onToolClick,
  } = useDragScroll();

  const filters = useMemo(
    () => ({
      part: selectedPart === "전체" ? "" : selectedPart,
      tool: selectedTool === "전체" ? "" : selectedTool,
      search: searchTerm,
    }),
    [selectedPart, selectedTool, searchTerm]
  );

  const { exercises, isLoading } = useExercises(filters);

  const toggleExercise = (ex) => {
    setSelectedExercises((prev) =>
      prev.some((item) => item._id === ex._id)
        ? prev.filter((item) => item._id !== ex._id)
        : [...prev, ex]
    );
  };

  const handleConfirm = () => {
    onSelect(selectedExercises);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>운동 추가하기</h2>
          <div className={styles.buttonGroup}>
            <button className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.addBtn}
              onClick={handleConfirm}
              disabled={selectedExercises.length === 0}
            >
              추가 ({selectedExercises.length})
            </button>
          </div>
        </header>

        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="🔍 어떤 운동을 찾으시나요?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.categorySection}>
          <div className={styles.tabScroll} ref={partRef} {...partHandlers}>
            {MUSCLE_PARTS.map((part) => (
              <button
                key={part}
                className={`${styles.categoryTab} ${
                  selectedPart === part ? styles.active : ""
                }`}
                onClick={() =>
                  onPartClick(() => {
                    setSearchTerm("");
                    setSelectedPart(part);
                  }, part)
                }
              >
                {part}
              </button>
            ))}
          </div>
          <div className={styles.tabScroll} ref={toolRef} {...toolHandlers}>
            {TOOLS.map((tool) => (
              <button
                key={tool}
                className={`${styles.categoryTab} ${
                  selectedTool === tool ? styles.active : ""
                }`}
                onClick={() =>
                  onToolClick(() => {
                    setSearchTerm("");
                    setSelectedTool(tool);
                  }, tool)
                }
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.listContainer}>
          {isLoading ? (
            <Spinner text="운동 목록 로딩 중..." />
          ) : exercises.length === 0 ? (
            <div className={styles.noResult}>검색 결과가 없습니다.</div>
          ) : (
            exercises.map((ex) => (
              <ExerciseItem
                key={ex._id}
                exercise={ex}
                isSelected={selectedExercises.some((s) => s._id === ex._id)}
                onToggle={() => toggleExercise(ex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ExerciseItem = ({ exercise, isSelected, onToggle }) => {
  const metaInfo = exercise.targetMuscles || "기타";

  return (
    <div
      className={`${styles.itemRow} ${isSelected ? styles.selected : ""}`}
      onClick={onToggle}
    >
      {isSelected && <div className={styles.selectionIndicator} />}
      <div className={styles.imageBox}>
        <MuscleMap selectedTags={metaInfo} />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{exercise.name}</p>
        <p className={styles.meta}>{metaInfo}</p>
      </div>
    </div>
  );
};

export default ExerciseSelectModal;
