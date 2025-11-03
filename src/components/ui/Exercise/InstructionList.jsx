import "./InstructionList.css";

const InstructionList = ({ description }) => {
  // if (!Array.isArray(items) || items.length === 0) {
  //   return null;
  // }

  return (
    <div className="instruction-list">
      <h4>준비</h4>
      <ul>
        {description.setup.map((item) => (
          <li key={`${item.step}-${item.text}`}>
            <span>{item.step}.</span> {item.text}
          </li>
        ))}
      </ul>
      <h4>움직임</h4>
      <ul>
        {description.movement.map((item) => (
          <li key={`${item.step}-${item.text}`}>
            <span>{item.step}.</span> {item.text}
          </li>
        ))}
      </ul>
      <h4>호흡법</h4>
      <ul>
        {description.breathing.map((item) => (
          <li key={`${item.step}-${item.text}`}>
            <span>{item.step}.</span> {item.text}
          </li>
        ))}
      </ul>
      <h4>팁</h4>
      <ul>
        {description.tips.map((item, index) => (
          <li key={`${index}-${item}`}>
            <span>{index + 1}.</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructionList;
