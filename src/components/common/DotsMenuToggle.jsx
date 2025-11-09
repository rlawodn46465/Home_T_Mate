import "./DotsMenuToggle.css";

const DotsMenuToggle = ({ onClick, isActive = false }) => {
  const containerClassName = `dots-toggle-container ${
    isActive ? "active" : ""
  }`;

  return (
    <div
      className={containerClassName}
      onClick={onClick}
      role="button"
      aria-expanded={isActive}
    >
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default DotsMenuToggle;
