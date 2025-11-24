import "./BodyPartFilter.css";

const BodyPartFilter = ({ parts, activePart, onPartChange }) => {
  return (
    <div className="body-part-filter-scroll">
      <div className="body-part-filter">
        {parts.map((part) => (
          <button
            key={part}
            className={`filter-button ${activePart === part ? "active" : ""}`}
            onClick={() => onPartChange(part)}
          >
            {part}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BodyPartFilter;
