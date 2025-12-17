import { useRef, memo } from "react";
import styles from "./PersonalDataForm.module.css";

const PersonalDataForm = () => {
  const dateInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);

  const handleWrapperClick = (ref) => {
    ref.current?.focus();
  };

  return (
    <div className={styles.form}>
      <h4 className="section-title">출생년도를 입력해주세요.</h4>
      <div
        className={styles.inputWrapper}
        onClick={() => handleWrapperClick(dateInputRef)}
      >
        <input
          id="date"
          ref={dateInputRef}
          className={styles.inputField}
          placeholder="YYYY"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
        />
        <label className={styles.unitText} htmlFor="date">
          년도
        </label>
      </div>

      <h4 className="section-title">키와 몸무게를 입력해주세요.</h4>
      <div className={styles.bodyInfoGroup}>
        <div
          className={styles.inputWrapper}
          onClick={() => handleWrapperClick(heightInputRef)}
        >
          <input
            id="height"
            ref={heightInputRef}
            className={styles.inputField}
            placeholder="000"
            type="number"
            step="0.1"
          />
          <label className={styles.unitText} htmlFor="height">
            키(cm)
          </label>
        </div>

        <div
          className={styles.inputWrapper}
          onClick={() => handleWrapperClick(weightInputRef)}
        >
          <input
            id="weight"
            ref={weightInputRef}
            className={styles.inputField}
            placeholder="00.0"
            type="number"
            step="0.1"
          />
          <label className={styles.unitText} htmlFor="weight">
            몸무게(kg)
          </label>
        </div>
      </div>
    </div>
  );
};

export default memo(PersonalDataForm);
