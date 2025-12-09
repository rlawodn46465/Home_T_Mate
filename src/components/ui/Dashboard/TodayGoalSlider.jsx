import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TodayGoalItem from "./TodayGoalItem";
import "./TodayGoalSlider.css";

const TodayGoalSlider = ({ goals }) => {
  const ITEM_HEIGHT = 40; // 아이템 높이(px)
  const wheelRef = useRef(null);
  const isScrolling = useRef(false);

  // 앞 + 뒤 더미 붙이기
  const extendedGoals = useMemo(() => {
    if (goals.length === 1) return goals;
    return [goals[goals.length - 1], ...goals, goals[0]];
  }, [goals]);

  const [index, setIndex] = useState(1);
  // 이동 중인지 판별
  const [isJumping, setIsJumping] = useState(false);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (isScrolling.current) return;

    isScrolling.current = true;

    setIndex((prev) => (e.deltaY > 0 ? prev + 1 : prev - 1));

    setTimeout(() => {
      isScrolling.current = false;
    }, 300);
  }, []);

  // DOM에 직업 passive: false 등록
  useEffect(() => {
    const wheelElement = wheelRef.current;
    if (wheelElement) {
      wheelElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (wheelElement) {
        wheelElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  // 무한 루프 보정
  useEffect(() => {
    // 목표가 1개 이하면 무한루프 불필요
    if (goals.length <= 1) return;

    if (index === 0) {
      setIsJumping(true);
      setIndex(goals.length);
    }

    if (index === goals.length + 1) {
      setIsJumping(true);
      setIndex(1);
    }

    if (isJumping && index >= 1 && index <= goals.length) {
      setIsJumping(false);
    }
  }, [index, goals.length, isJumping]);

  return (
    <div ref={wheelRef} className="wheel-wrapper">
      <ul
        className="wheel-list"
        style={{
          transform: `translateY(-${index * ITEM_HEIGHT}px)`,
          transition: isJumping ? "none" : "transform 0.3s ease-out",
        }}
      >
        {extendedGoals.map((goal, i) => (
          <TodayGoalItem key={`${goal.id}-${i}`} goal={goal} />
        ))}
      </ul>
    </div>
  );
};

export default TodayGoalSlider;
