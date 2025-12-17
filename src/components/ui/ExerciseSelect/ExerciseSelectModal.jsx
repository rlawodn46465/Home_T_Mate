import { useMemo, useState } from "react";
import { useExercises } from "../../../hooks/useExercises";
import { useDragScroll } from "../../../hooks/useDragScroll";

import "./ExerciseSelectModal.css";
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
  // 사용자 선택한 운동 목록
  const [selectedExercises, setSelectedExercises] = useState([]);

  // 신체 부위 탭
  const {
    scrollRef: partScrollRef,
    isDragging: isPartDragging,
    dragHandlers: partDragHandlers,
    handleTabClick: handlePartTabClick,
  } = useDragScroll();

  // 기구 탭
  const {
    scrollRef: toolScrollRef,
    isDragging: isToolDragging,
    dragHandlers: toolDragHandlers,
    handleTabClick: handleToolTabClick,
  } = useDragScroll();

  const filters = useMemo(
    () => ({
      part: selectedPart === "전체" ? "" : selectedPart,
      tool: selectedTool === "전체" ? "" : selectedTool,
      search: searchTerm,
    }),
    [selectedPart, selectedTool, searchTerm]
  );

  // 커스텀 훅을 통한 데이터, 로딩/에러 상태
  const { exercises, isLoading } = useExercises(filters);

  // 운동 선택/해제 핸들러
  const handleToggleExercise = (exercise) => {
    setSelectedExercises(
      (prev) =>
        prev.some((ex) => ex._id === exercise._id)
          ? prev.filter((ex) => ex._id !== exercise._id) //제거
          : [...prev, exercise] //추가
    );
  };

  const handleAddSelectedExercises = () => {
    onSelect(selectedExercises);
    onClose();
  };

  // 신체 부위 탭 클릭 핸들러
  const handlePartSelect = (part) => {
    handlePartTabClick(() => {
      setSearchTerm("");
      setSelectedPart(part);
    }, part);
  };

  const handleToolSelect = (tool) => {
    handleToolTabClick(() => {
      setSearchTerm("");
      setSelectedTool(tool);
    }, tool);
  };

  return (
    <div className="exercise-select-modal" onClick={onClose}>
      <div
        className="exercise-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>운동 추가하기</h2>
          <div className="button-group">
            <button className="modal-cancel-button" onClick={onClose}>
              취소
            </button>
            <button
              className="modal-add-button"
              onClick={handleAddSelectedExercises}
              disabled={selectedExercises.length === 0}
            >
              추가 ({selectedExercises.length})
            </button>
          </div>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="🔍 운동 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-container">
          <div
            className={`tab-scroll-container part-tabs ${
              isPartDragging ? "dragging" : ""
            }`}
            ref={partScrollRef}
            {...partDragHandlers}
          >
            {MUSCLE_PARTS.map((part) => (
              <button
                key={part}
                className={`category-tab ${
                  selectedPart === part ? "active" : ""
                }`}
                onClick={() => handlePartSelect(part)}
              >
                {part}
              </button>
            ))}
          </div>
          <div
            className={`tab-scroll-container tool-tabs ${
              isToolDragging ? "dragging" : ""
            }`}
            ref={toolScrollRef}
            {...toolDragHandlers}
          >
            {TOOLS.map((tool) => (
              <button
                key={tool}
                className={`category-tab ${
                  selectedTool === tool ? "active" : ""
                }`}
                onClick={() => handleToolSelect(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>
        <div className="exercise-list-container">
          {isLoading ? (
            <Spinner text={"운동 목록을 불러오는 중..."}/>
          ) : exercises.length === 0 ? (
            <p className="no-result">결과가 없습니다.</p>
          ) : (
            exercises.map((ex) => {
              const isSelected = selectedExercises.some(
                (sEx) => sEx._id === ex._id
              );

              const metaInfo = [ex.targetMuscles].filter(Boolean).join(", ");

              return (
                <div
                  key={ex._id}
                  className={`exercise-item-row ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleToggleExercise(ex)}
                >
                  <div className="image-placeholder">
                    <MuscleMap selectedTags={metaInfo} />
                  </div>

                  <div className="exercise-info">
                    <p className="exercise-name">{ex.name}</p>
                    <p className="exercise-meta">{metaInfo}</p>
                  </div>
                  {isSelected && <div className="selection-indicator"></div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelectModal;
