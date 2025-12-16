import { useState, useRef, useEffect } from "react";
import "./SelectBox.css";

const SelectBox = ({ options, value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || options[0].label;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectRef]);

  const handleSelect = (newValue) => {
    const syntheticEvent = {
      target: {
        value: newValue,
      },
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select-box-wrap ${className}`} ref={selectRef}>
      <div
        className="custom-select-button"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex="0"
      >
        <span className="selected-label">{selectedLabel}</span>
        <span
          className={`select-arrow ${isOpen ? "open" : ""}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </div>

      {isOpen && (
        <ul className="custom-dropdown-list">
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-item ${
                option.value === value ? "selected" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              <span className="radio-indicator"></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectBox;
