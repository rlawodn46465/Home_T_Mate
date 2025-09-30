import "./GenderSelector.css";

const GenderSelector = () => {
  return (
    <div className="gender-selector">
      <h4>성별을 선택해주세요.</h4>
      <div className="gender-container">
        <button className="gender-button">남성</button>
        <button className="gender-button">여성</button>
      </div>
    </div>
  );
};

export default GenderSelector;
