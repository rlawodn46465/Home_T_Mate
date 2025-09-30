import { useRef } from "react";
import "./PersonalDataForm.css";

const PersonalDataForm = () => {
  const dateInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);

  const focusInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div className="personal-data-form">
      <h4>출생년도를 입력해주세요.</h4>
      <div
        className="personal-data-input"
        onClick={() => focusInput(dateInputRef)}
      >
        <input id="date" ref={dateInputRef} placeholder="YYYY" />
        <label className="personal-input-text" htmlFor="date">
          년도
        </label>
      </div>
      <h4>키와 몸무게를 입력해주세요.</h4>
      <div className="personal-body-info">
        <div
          className="personal-data-input"
          onClick={() => focusInput(heightInputRef)}
        >
          <input id="height" ref={heightInputRef} placeholder="000" />
          <label className="personal-input-text" htmlFor="height">
            키(cm)
          </label>
        </div>
        <div
          className="personal-data-input"
          onClick={() => focusInput(weightInputRef)}
        >
          <input id="weight" ref={weightInputRef} placeholder="000.0" />
          <label className="personal-input-text" htmlFor="weight">
            몸무게(kg)
          </label>
        </div>
      </div>
    </div>
  );
};

export default PersonalDataForm;
