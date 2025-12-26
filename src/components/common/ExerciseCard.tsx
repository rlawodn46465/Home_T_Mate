import { useState, useMemo } from "react";
import type { MouseEvent } from "react";
import styles from "./ExerciseCard.module.css";
import DotsMenuToggle from "./DotsMenuToggle";
import DropdownMenu from "./DropdownMenu";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";

interface ExerciseSet {
  weight: number;
  reps: number;
}

export interface ExerciseRecord {
  id: string;
  exerciseId: string;
  type: "개별운동" | "루틴" | "챌린지" | string;
  name: string;
  category: string | string[];
  completed: boolean;
  sets: ExerciseSet[];
  duration: number;
  date: string;
}

interface ExerciseCardProps {
  record: ExerciseRecord;
  isMenuSelector?: boolean;
  isDetailSelector?: boolean;
  onEdit?: (record: ExerciseRecord) => void;
  onDelete?: (id: string) => void;
}

const formatDuration = (totalSeconds: number): string => {
  if (!totalSeconds || totalSeconds < 0) return "0초";

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return seconds > 0 ? `${minutes}분 ${seconds}초` : `${minutes}분`;
  }
  return `${seconds}초`;
};

const ExerciseCard = ({
  record,
  isMenuSelector = true,
  isDetailSelector = true,
  onEdit,
  onDelete,
}: ExerciseCardProps) => {
  const { navigateToPanel, currentPath } = usePersistentPanel();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    id: recordId,
    exerciseId,
    type,
    name,
    category,
    completed,
    sets,
    duration,
    date,
  } = record;

  // 메모이제이션을 통한 포맷팅 최적화
  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);
  const formattedCategory = useMemo(
    () => (Array.isArray(category) ? category.join(", ") : category),
    [category]
  );

  // 메뉴 액션 핸들러
  const handleAction = (action: "edit" | "delete", e: MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    setIsMenuOpen(false);

    if (!recordId) return console.error("기록 ID가 없습니다.");

    if (action === "edit") {
      onEdit?.(record);
    } else if (action === "delete") {
      if (window.confirm(`'${name}' 기록을 삭제하시겠습니까?`)) {
        onDelete?.(recordId);
      }
    }
  };

  const handleCardClick = () => {
    if (isMenuOpen || !isDetailSelector) return;

    if (exerciseId) {
      navigateToPanel(
        `?panel=exercise-detail&exerciseId=${exerciseId}`,
        currentPath
      );
    } else {
      console.error("운동 ID가 없습니다.");
    }
  };

  // 타입 박스 렌더링 로직
  const renderTypeTag = () => {
    if (type === "개별운동") return null;
    const typeClass =
      type === "루틴"
        ? styles.typeRoutine
        : type === "챌린지"
        ? styles.typeChallenge
        : styles.typeDefault;
    return <div className={`${styles.typeBox} ${typeClass}`}>{type}</div>;
  };

  return (
    <div
      className={`${styles.card} ${completed ? styles.completed : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      {renderTypeTag()}

      <div className={styles.header}>
        <h4 className={styles.name}>{name}</h4>

        {isMenuSelector && (
          <div className={styles.toggleWrapper}>
            <DotsMenuToggle
              isActive={isMenuOpen}
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            />
            {isMenuOpen && (
              <DropdownMenu position="right">
                <li onClick={(e) => handleAction("edit", e)}>수정</li>
                <li onClick={(e) => handleAction("delete", e)}>삭제</li>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      <div className={styles.meta}>
        <div className={styles.infoContainer}>
          <p className={styles.category}>{formattedCategory}</p>
          {sets.map((set, idx) => (
            <div key={`${recordId}-set-${idx}`} className={styles.setData}>
              {`${set.weight}kg × ${set.reps}회`}
            </div>
          ))}
        </div>

        <div className={styles.timeContainer}>
          <p className={styles.durationText}>{formattedDuration}</p>
          <p className={styles.dateText}>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
