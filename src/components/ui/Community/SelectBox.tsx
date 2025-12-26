import { useState, useRef, useEffect } from "react";
import styles from "./SelectBox.module.css";

export interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectBoxProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (event: { target: { value: T } }) => void;
  className?: string;
}

const SelectBox = <T extends string | number>({
  options,
  value,
  onChange,
  className = "",
}: SelectBoxProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || options[0].label;

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 선택 시 부모의 onChange에 가상 이벤트 전달
  const handleSelect = (newValue: T) => {
    onChange({ target: { value: newValue } });
    setIsOpen(false);
  };

  return (
    <div className={`${styles.selectBoxWrap} ${className}`} ref={selectRef}>
      <div
        className={styles.selectButton}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.dropdownItem} ${
                option.value === value ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              <div className={styles.radioIndicator} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectBox;
