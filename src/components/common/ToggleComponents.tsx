import { memo } from "react";
import styles from "./ToggleComponents.module.css";

interface ToggleComponentsProps {
  isUp: boolean;
}

const ToggleComponents = ({ isUp }: ToggleComponentsProps) => {
  const chevronClassName = `${styles.chevron} ${isUp ? styles.active : ""}`;

  return (
    <div className={styles.container} aria-expanded={isUp} role="button">
      <span className={chevronClassName} />
    </div>
  );
};

export default memo(ToggleComponents);
