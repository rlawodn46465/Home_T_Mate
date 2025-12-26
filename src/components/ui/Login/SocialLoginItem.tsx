import type { KeyboardEvent } from "react";
import styles from "./SocialLoginItem.module.css";

interface SocialLoginItemProps {
  id: string;
  iconSrc: string;
  text: string;
  onClick?: () => void;
}

const SocialLoginItem = ({
  id,
  iconSrc,
  text,
  onClick,
}: SocialLoginItemProps) => {
  const itemClassName = `${styles.item} ${styles[id] || ""}`;

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <li
      className={itemClassName}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <img src={iconSrc} alt={`${text} 로고`} className={styles.icon} />
      <span className={styles.text}>{text}</span>
    </li>
  );
};

export default SocialLoginItem;
