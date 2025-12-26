import { useState } from "react";
import type { MouseEvent } from "react";
import styles from "./GoalItemCard.module.css";
import ContextualMenu from "./ContextualMenu";
import type { ContextualMenuOption } from "./ContextualMenu";
import { usePersistentPanel } from "../../../../hooks/usePersistentPanel";

interface GoalData {
  id: string | number;
  goalTypeLabel: string;
  name: string;
  progress: number;
  parts: string[];
  activeDaysLabel?: string;
  activeDays?: string[];
  creator: string;
}

interface GoalItemCardProps {
  goals: GoalData;
  onAction?: (id: string | number, action: ContextualMenuOption) => void;
  isDeleting?: boolean;
  onClickOverride?: (goal: GoalData) => void;
  hidenMenu?: boolean;
}

const GoalItemCard = ({
  goals,
  onAction,
  isDeleting = false,
  onClickOverride = null,
  hidenMenu = false,
}: GoalItemCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { goalTypeLabel, name, progress, parts, activeDaysLabel, creator } =
    goals;
  // 진행도 바
  const progressPercent = (progress * 100).toFixed(0);

  const { navigateToPanel, currentPath } = usePersistentPanel();

  const handleCardClick = () => {
    if (isDeleting) return;

    if (onClickOverride) {
      onClickOverride(goals);
      return;
    }

    if (!isMenuOpen) {
      const newQuery = `?panel=goals-detail&goalId=${goals.id}`;
      navigateToPanel(newQuery, currentPath);
    }
  };

  const handleOptionsClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // 카드 클릭 이벤트가 부모로 전파되는 것을 막습니다.
    if (isDeleting) return;
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuSelect = (action: ContextualMenuOption) => {
    setIsMenuOpen(false);

    if (action === "수정") {
      const newQuery = `?panel=goals-form&goalId=${goals.id}&isEditMode=true`;
      navigateToPanel(newQuery, currentPath);
    } else {
      if (onAction) onAction(goals.id, action);
    }
  };

  return (
    // 삭제중 스타일링 할지 고민할 것
    <div
      className={`${styles.goalCard} ${
        isDeleting ? styles.goalCardDeleting : ""
      }`}
      onClick={handleCardClick}
    >
      <div className={styles.header}>
        <span
          className={`${styles.typeTag} ${styles[`typeTag${goalTypeLabel}`]}`}
        >
          {goalTypeLabel}
        </span>
        <h5 className={styles.title}>{name}</h5>
        {!hidenMenu && (
          <div className={styles.options}>
            <button
              className={styles.optionsBtn}
              onClick={handleOptionsClick}
              disabled={isDeleting}
            >
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </button>
            {isMenuOpen && <ContextualMenu onSelect={handleMenuSelect} />}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.infoProgress}>
          진행도 :
          {goalTypeLabel === "챌린지" ? (
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBar}
                style={{ width: `${progressPercent}%` }}
              ></div>
              <span className={styles.progressLabel}>{progressPercent}%</span>
            </div>
          ) : (
            <p>{progress}주차</p>
          )}
        </div>
        <p>부위: {parts.join(", ")}</p>
        <div className={styles.progressBottom}>
          <p>빈도: {activeDaysLabel}</p>
          <p>제작자: {creator}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalItemCard;
