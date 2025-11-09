import './ToggleComponents.css';

const ToggleComponents = ({isUp}) => {

  const chevronClassName = isUp ? "chevron-up" : "chevron-down";

  return (
    <div className="toggle-container">
      <div className={`chevron ${chevronClassName}`}></div>
    </div>
  );
};

export default ToggleComponents;