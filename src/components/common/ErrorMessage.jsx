import styles from "./ErrorMessage.module.css";

const ErrorMessage = ({
  message = "문제가 발생했습니다. 다시 시도해 주세요.",
  onRetry,
}) => {
  return (
    <div className={styles.wrapper}>
      <span style={{ fontSize: "24px", marginBottom: "10px" }}>⚠️</span>

      <p className={styles.text}>{message}</p>

      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry} type="button">
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
