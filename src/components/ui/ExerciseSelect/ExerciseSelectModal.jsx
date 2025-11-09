import { useCallback, useEffect, useRef, useState } from "react";

import "./ExerciseSelectModal.css";

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
]; // '등', '하체' 추가
const TOOLS = ["전체", "맨몸", "덤벨", "바벨", "벤치"];

const ExerciseSelectModal = ({ onClose, onSelect }) => {
  const [selectedPart, setSelectedPart] = useState("전체");
  const [selectedTool, setSelectedTool] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 드래그 스크롤
  const partScrollRef = useRef(null);
  const toolScrollRef = useRef(null);
  const [isPartDragging, setIsPartDragging] = useState(false);
  const [isToolDragging, setIsToolDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 사용자 선택한 운동 목록
  const [selectedExercises, setSelectedExercises] = useState([]);

  // API 호출 로직
  const loadExercises = useCallback(async (part, tool, search) => {
    setIsLoading(true);
    try {
      const data = await fetchExercises(part, tool, search);
      setExercises(data);
    } catch (error) {
      console.error("운동 목록을 불러오는데 실패했습니다:", error);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 필터/검색 조건 변경시 운동 목록 재로드
  useEffect(() => {
    loadExercises(selectedPart, selectedTool, searchTerm);
  }, [selectedPart, selectedTool, searchTerm, loadExercises]);

  // 운동 선택/해제 핸들러
  const handleToggleExercise = (exercise) => {
    setSelectedExercises(
      (prev) =>
        prev.some((ex) => ex.id === exercise.id)
          ? prev.filter((ex) => ex.id !== exercise.id) //제거
          : [...prev, exercise] //추가
    );
  };

  const handleAddSelectedExercises = () => {
    onSelect(selectedExercises);
    // onClose();
  };

  const handleMouseDown = (e, ref, setIsDraggingState) => {
    setIsDraggingState(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
  };

  const handleMouseLeaveOrUp = (ref, setIsDraggingState) => {
    setIsDraggingState(false);
    if (ref.current) {
      ref.current.style.cursor = "grab";
      ref.current.style.userSelect = "auto";
    }
  };

  const handleMouseMove = (e, ref, isDraggingState) => {
    if (!isDraggingState || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  // 탭 클릭 시 드래그 중이 아닌지 확인
  const handleTabClick = (setter, value, isDraggingState) => {
    if (isDraggingState) return;
    setter(value);
  };

  // 신체 부위 탭 드래그 핸들러
  const partDragHandlers = {
    onMouseDown: (e) => handleMouseDown(e, partScrollRef, setIsPartDragging),
    onMouseLeave: () => handleMouseLeaveOrUp(partScrollRef, setIsPartDragging),
    onMouseUp: () => handleMouseLeaveOrUp(partScrollRef, setIsPartDragging),
    onMouseMove: (e) => handleMouseMove(e, partScrollRef, isPartDragging),
  };

  // 운동 기구 탭 드래그 핸들러
  const toolDragHandlers = {
    onMouseDown: (e) => handleMouseDown(e, toolScrollRef, setIsToolDragging),
    onMouseLeave: () => handleMouseLeaveOrUp(toolScrollRef, setIsToolDragging),
    onMouseUp: () => handleMouseLeaveOrUp(toolScrollRef, setIsToolDragging),
    onMouseMove: (e) => handleMouseMove(e, toolScrollRef, isToolDragging),
  };

  return (
    <div className="exercise-select-modal">
      <div className="exercise-modal-content">
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
                onClick={() =>
                  handleTabClick(setSelectedPart, part, isPartDragging)
                }
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
                onClick={() => handleTabClick(setSelectedTool, tool, isToolDragging)}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>
        <div className="exercise-list-container">
          {isLoading ? (
            <p className="loading-state">운동 목록을 불러오는 중...</p>
          ) : exercises.length === 0 ? (
            <p className="no-result">결과가 없습니다.</p>
          ): (exercises.map((ex) => {
              const isSelected = selectedExercises.some(
                (sEx) => sEx.id === ex.id
              );
              return (
                <div
                  key={ex.id}
                  className={`exercise-item-row ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleToggleExercise(ex)}
                >
                  <div className="image-placeholder"></div>
                  <div className="exercise-info">
                    <p className="exercise-name">{ex.name}</p>
                    <p className="exercise-meta">
                      {ex.musclePart},{ex.tool}
                    </p>
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
