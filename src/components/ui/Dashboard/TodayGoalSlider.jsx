import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import TodayGoalItem from "./TodayGoalItem";
import NoGoalItem from "./NoGoalItem";
import styles from "./TodayGoalSlider.module.css";

const ITEM_HEIGHT = 40;

const TodayGoalSlider = ({ goals }) => {
  const wheelRef = useRef(null);
  const isScrolling = useRef(false);

  const isNoGoal = !goals || goals.length === 0;
  const isSingleGoal = goals.length === 1;
  const isScrollable = goals.length >= 2;

  // 데이터 확장
  const extendedGoals = useMemo(() => {
    if (!isScrollable) return goals;
    return [goals[goals.length - 1], ...goals, goals[0]];
  }, [goals, isScrollable]);

  const [index, setIndex] = useState(isSingleGoal ? 0 : 1);
  const [isJumping, setIsJumping] = useState(false);

  // 휠 핸들러
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

  // Wheel 이벤트 차단용
  useEffect(() => {
    const wheelElement = wheelRef.current;
    if (wheelElement && isScrollable) {
      wheelElement.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (wheelElement) wheelElement.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel, isScrollable]);

  // 무한 루프 위치 보정
  useEffect(() => {
    if (!isScrollable) return;

    if (index === 0) {
      setIsJumping(true);
      setIndex(goals.length);
    } else if (index === goals.length + 1) {
      setIsJumping(true);
      setIndex(1);
    } else if (isJumping) {
      setIsJumping(false);
    }
  }, [index, goals.length, isJumping, isScrollable]);

  // 스타일 동적 계산
  const listStyle = {
    transform: isSingleGoal ? "none" : `translateY(-${index * ITEM_HEIGHT}px)`,
    transition: isJumping ? "none" : "transform 0.3s ease-out",
  };

  if (isNoGoal) {
    return (
      <div className={styles.wrapper}>
        <ul className={`${styles.list} ${styles.centered}`}>
          <NoGoalItem />
        </ul>
      </div>
    );
  }

  return (
    <div ref={wheelRef} className={styles.wrapper}>
      <ul className={styles.list} style={listStyle}>
        {extendedGoals.map((goal, i) => (
          <TodayGoalItem key={`${goal.id || "goal"}-${i}`} goal={goal} />
        ))}
      </ul>
    </div>
  );
};2

export default memo(TodayGoalSlider);
