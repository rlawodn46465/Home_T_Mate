import "./ErrorMessage.css";

const ErrorMessage = ({
  message = "문제가 발생했습니다.",
  onRetry,
}) => {
  return (
    <div className="error-wrapper">
      <p className="error-text">{message}</p>

      {onRetry && (
        <button
          className="error-retry-btn"
          onClick={onRetry}
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
