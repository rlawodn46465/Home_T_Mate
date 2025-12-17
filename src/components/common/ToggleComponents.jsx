import React, { memo } from "react";
import styles from "./ToggleComponents.module.css";

const ToggleComponents = ({ isUp }) => {
  const chevronClassName = `${styles.chevron} ${isUp ? styles.active : ""}`;

  return (
    <div className={styles.container} aria-expanded={isUp} role="button">
      <span className={chevronClassName} />
    </div>
  );
};

export default memo(ToggleComponents);
