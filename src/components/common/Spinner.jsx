import React, { memo } from "react";
import styles from "./Spinner.module.css";

const Spinner = ({ size = "md", text }) => {
  const spinnerClass = [styles.spinner, styles[size] || styles.md].join(" ");

  return (
    <div className={styles.wrapper}>
      <div className={spinnerClass} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default memo(Spinner);