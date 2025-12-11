import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TodayGoalItem from "./TodayGoalItem";
import NoGoalItem from "./NoGoalItem";
import "./TodayGoalSlider.css";

const TodayGoalSlider = ({ goals }) => {
  const ITEM_HEIGHT = 40; // 아이템 높이(px)
  const wheelRef = useRef(null);
  const isScrolling = useRef(false);

  const isNoGoal = goals.length === 0;
  const isSingleGoal = goals.length === 1;
  const isScrollable = goals.length >= 2;

  // 앞 + 뒤 더미 붙이기
  const extendedGoals = useMemo(() => {
    if (isSingleGoal) return goals;
    return [goals[goals.length - 1], ...goals, goals[0]];
  }, [goals, isSingleGoal]);

  const [index, setIndex] = useState(isSingleGoal ? 0 : 1);
  // 이동 중인지 판별
  const [isJumping, setIsJumping] = useState(false);

  const handleWheel = useCallback(
    (e) => {
      if (!isScrollable) return;

      e.preventDefault();
      if (isScrolling.current) return;

      isScrolling.current = true;
      setIndex((prev) => (e.deltaY > 0 ? prev + 1 : prev - 1));
      setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    },
    [isScrollable]
  );

  // DOM에 직업 passive: false 등록
  useEffect(() => {
    const wheelElement = wheelRef.current;
    if (wheelElement && !isSingleGoal) {
      wheelElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (wheelElement) {
        wheelElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel, isSingleGoal]);

  // 무한 루프 보정
  useEffect(() => {
    // 목표가 1개 이하면 무한루프 불필요
    if (isSingleGoal) return;

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
  }, [index, goals.length, isJumping, isSingleGoal]);

  // 목표가 없을 경우
  if (isNoGoal) {
    return (
      <div className="wheel-wrapper">
        <ul className="wheel-list" style={{ transform: "none" }}>
          <NoGoalItem />
        </ul>
      </div>
    );
  }

  return (
    <div ref={wheelRef} className="wheel-wrapper">
      <ul
        className="wheel-list"
        style={{
          transform: isSingleGoal
            ? "none"
            : `translateY(-${index * ITEM_HEIGHT}px)`,
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
