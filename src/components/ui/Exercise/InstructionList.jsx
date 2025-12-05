import "./InstructionList.css";

const InstructionList = ({ description }) => {
  const isListValid = (list) => {
    return list && list[0].text !== "" && list[0] !== "";
  };

  const { setup, movement, breathing, tips } = description;

  return (
    <div className="instruction-list">
      {isListValid(setup) && (
        <>
          <h4>준비</h4>
          <ul>
            {setup.map((item) => (
              <li key={`setup-${item.step}`}>
                <span>{item.step}.</span> {item.text}
              </li>
            ))}
          </ul>
        </>
      )}
      {isListValid(movement) && (
        <>
          <h4>움직임</h4>
          <ul>
            {movement.map((item) => (
              <li key={`movement-${item.step}`}>
                <span>{item.step}.</span> {item.text}
              </li>
            ))}
          </ul>
        </>
      )}
      {isListValid(breathing) && (
        <>
          <h4>호흡법</h4>
          <ul>
            {breathing.map((item) => (
              <li key={`breathing-${item.step}`}>
                <span>{item.step}.</span> {item.text}
              </li>
            ))}
          </ul>
        </>
      )}
      {isListValid(tips) && (
        <>
          <h4>팁</h4>
          <ul>
            {tips.map((item, index) => (
              <li key={`tip-${index}`}>
                <span>{index + 1}.</span> {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default InstructionList;
