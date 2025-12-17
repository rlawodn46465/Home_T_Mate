import { memo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PageHeader.module.css";

const PageHeader = ({ title, onGoBack }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (typeof onGoBack === "function") {
      onGoBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleGoBack}
      >
        뒤로가기
      </button>
    </header>
  );
};

export default memo(PageHeader);
