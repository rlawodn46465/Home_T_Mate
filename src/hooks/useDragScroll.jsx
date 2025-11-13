import { useState, useCallback, useRef } from "react";

// [1. 커스텀 훅 import]
// import { useDragScroll } from '경로';
// [2. 훅 호출]
// const {
//   scrollRef, // 스크롤이 적용될 DOM 요소의 Ref
//   isDragging, // 현재 드래그 중인지 여부 (스타일/클릭 방지용)
//   dragHandlers, // 마우스 이벤트 핸들러들 (onMouseDown, onMouseUp, etc.)
//   handleTabClick, // 탭 클릭 핸들러 (드래그 중 클릭 방지 로직 포함)
// } = useDragScroll();
// [3. 스크롤 컨테이너에 속성 바인딩]

// <div
//  className={`tab-list ${isDragging ? "dragging" : ""}`}
//  ref={scrollRef}
//  {...dragHandlers}
// ></div>

// [4. 탭 클릭 핸들러 사용]
// onClick={() =>
//   handleTabClick(setSelectedDay, day)
// }

// 마우스 이동 거리기 값(px)보다 작으면 단순 클릭 간주
const DRAG_THRESHOLD = 5;

export const useDragScroll = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMoved, setIsMoved] = useState(false);

  // 드래그 시작
  const onMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;

    // 드래그 중, 탭 클릭 이벤트 방지
    setIsMoved(false);
    setIsDragging(true);

    // 드래그 계산을 위한 초기값 저장
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartY(e.pageY);
    setScrollLeft(scrollRef.current.scrollLeft);

    // 효과
    scrollRef.current.style.cursor = "grabbing";
    scrollRef.current.style.userSelect = "none";
  }, []);

  // 드래그 종료
  const onMouseLeaveOrUp = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
      scrollRef.current.style.userSelect = "auto";
    }
    // 드래깅 상태 결정
    if (isMoved) {
      setTimeout(() => setIsDragging(false), 100);
    } else {
      setIsDragging(false);
    }
  }, [isMoved]);

  // 스크롤
  const onMouseMove = useCallback(
    (e) => {
      if (!isDragging || !scrollRef.current) return;
      e.preventDefault();

      const x = e.pageX - scrollRef.current.offsetLeft;
      const y = e.pageY;

      const dx = Math.abs(x - startX);
      const dy = Math.abs(y - startY);

      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        setIsMoved(true);
      }

      // 이동 속도 조절 상수 (1.5)
      const walk = (x - startX) * 1.5;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, startY, scrollLeft]
  );

  // 드래그 중이면 클릭 무시
  const handleTabClick = useCallback(
    (setter, value) => {
      if (isMoved) return;
      setter(value);
    },
    [isMoved]
  );

  const dragHandlers = {
    onMouseDown,
    onMouseLeave: onMouseLeaveOrUp,
    onMouseUp: onMouseLeaveOrUp,
    onMouseMove,
  };

  return {
    scrollRef,
    isDragging: isMoved,
    dragHandlers,
    handleTabClick,
  };
};
