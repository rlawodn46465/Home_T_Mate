import { useState, memo } from "react";
import styles from "./GenderSelector.module.css";

type Gender = "M" | "F";

interface GenderSelectorProps {
  onChange?: (gender: Gender) => void;
}

const GenderSelector = ({ onChange }: GenderSelectorProps) => {
  const [selected, setSelected] = useState<Gender | null>(null);

  const handleSelect = (gender: Gender) => {
    setSelected(gender);
    onChange?.(gender);
  };

  return (
    <div className={styles.container}>
      <h4 className="section-title">성별을 선택해주세요.</h4>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.genderButton} ${
            selected === "M" ? styles.active : ""
          }`}
          onClick={() => handleSelect("M")}
        >
          남성
        </button>
        <button
          type="button"
          className={`${styles.genderButton} ${
            selected === "F" ? styles.active : ""
          }`}
          onClick={() => handleSelect("F")}
        >
          여성
        </button>
      </div>
    </div>
  );
};

export default memo(GenderSelector);
