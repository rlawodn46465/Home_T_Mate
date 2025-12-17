import styles from "./SocialLoginItem.module.css";

const SocialLoginItem = ({ id, iconSrc, text, onClick }) => {
  const itemClassName = `${styles.item} ${styles[id] || ""}`;

  return (
    <li
      className={itemClassName}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
    >
      <img src={iconSrc} alt={`${text} 로고`} className={styles.icon} />
      <span className={styles.text}>{text}</span>
    </li>
  );
};

export default SocialLoginItem;
