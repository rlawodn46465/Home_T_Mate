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

// 서버 API 호출 함수
const fetchExercisesApi = async (part, tool, search) => {
  // API 엔드포인트
  const API_ENDPOINT = "/api/v1/exercises";

  const queryParams = new URLSearchParams();

  if (part !== "전체") {
    queryParams.append("targetMuscles", part);
  }
  if (tool !== "전체") {
    queryParams.append("equipment", tool);
  }
  if (search) {
    queryParams.append("search", search);
  }

  const url = `http://localhost:3000${API_ENDPOINT}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.exercises || data;
  } catch (error) {
    throw new Error(
      "운동 목록을 불러오는 데 실패했습니다. 서버 상태를 확인하세요."
    );
  }
};

const ExerciseSelectModal = ({ onClose, onSelect }) => {
  const [selectedPart, setSelectedPart] = useState("전체");
  const [selectedTool, setSelectedTool] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // 에러 상태 추가

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
    setError(null);
    try {
      const data = await fetchExercisesApi(part, tool, search);
      const mappedData = data.map((ex) => ({
        ...ex,
        id: ex.id || ex._id,
      }));
      setExercises(mappedData);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 필터/검색 조건 변경시 운동 목록 재로드
  useEffect(() => {
    // 검색어 입력이 멈춘 후 잠시 뒤에 로드하도록 최적화
    const debounceTimer = setTimeout(() => {
      loadExercises(selectedPart, selectedTool, searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
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
    onClose();
  };

  const handleMouseDown = (e, ref, setIsDraggingState) => {
    // 탭 클릭 이벤트가 발생하지 않도록 true 설정
    setIsDraggingState(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
  };

  const handleMouseLeaveOrUp = (ref, setIsDraggingState) => {
    setTimeout(() => {
      setIsDraggingState(false);
    }, 100);

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
                onClick={() =>
                  handleTabClick(setSelectedTool, tool, isToolDragging)
                }
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
          ) : (
            exercises.map((ex) => {
              const isSelected = selectedExercises.some(
                (sEx) => sEx.id === ex.id
              );
              // 운동 메타 정보 조합
              const metaInfo = [ex.targetMuscles, ex.equipment].filter(Boolean).join(', ');
              
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
                      {metaInfo}
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
