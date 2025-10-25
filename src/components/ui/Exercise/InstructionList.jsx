import './InstructionList.css';

const InstructionList = ({ title, items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className="instruction-list">
      <h4>{title}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>
            <span>{index + 1}.</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructionList;
