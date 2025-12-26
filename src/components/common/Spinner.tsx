import React, { memo } from "react";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "md";
  text?: string;
}

const Spinner = ({ size = "md", text }: SpinnerProps) => {
  const spinnerClass = [styles.spinner, styles[size] || styles.md].join(" ");

  return (
    <div className={styles.wrapper}>
      <div className={spinnerClass} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default memo(Spinner);
