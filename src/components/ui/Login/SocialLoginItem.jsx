import "./SocialLoginItem.css";

const SocialLoginItem = ({ id, iconSrc, text, onClick }) => {
  return (
    <li className={`login-item ${id}`} onClick={onClick}>
      <img
        src={iconSrc}
        alt={`${text} 아이콘`}
        className={"login-icon"}
      />
      <p className="login-text">{text}</p>
    </li>
  );
};

export default SocialLoginItem;