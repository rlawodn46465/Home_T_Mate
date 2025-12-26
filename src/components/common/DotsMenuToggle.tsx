import styles from "./DotsMenuToggle.module.css";

interface DotsMenuToggleProps {
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  isActive?: boolean;
}

const DotsMenuToggle = ({ onClick, isActive = false }: DotsMenuToggleProps) => {
  const handleAction = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(e);
    }
  };

  return (
    <div
      className={`${styles.container} ${isActive ? styles.active : ""}`}
      onClick={handleAction}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label="메뉴 토글"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
};

export default DotsMenuToggle;
