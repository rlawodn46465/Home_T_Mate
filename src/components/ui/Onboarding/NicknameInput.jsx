import "./NicknameInput.css";

const NicknameInput = () => {
  return (
    <div className="nickname-input">
      <h4>닉네임을 입력해주세요.</h4>
      <div className="nickname-input-container">
        <input />
        <button className="nickname-button">확인</button>
      </div>
      <p className="option-text">닉네임이 존재합니다.</p>
    </div>
  );
};

export default NicknameInput;
