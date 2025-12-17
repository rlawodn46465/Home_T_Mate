import styles from "./DotsMenuToggle.module.css";

const DotsMenuToggle = ({ onClick, isActive = false }) => {
  return (
    <div
      className={`${styles.container} ${isActive ? styles.active : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label="메뉴 토글"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e);
        }
      }}
    >
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
};

export default DotsMenuToggle;
