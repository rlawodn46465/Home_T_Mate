import styles from "./InstructionList.module.css";

const InstructionSection = ({ title, items, isTip = false }) => {
  if (
    !items ||
    items.length === 0 ||
    (items[0]?.text === "" && items[0] === "")
  )
    return null;

  return (
    <div className={styles.section}>
      <h4>{title}</h4>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.stepNumber}>
              {isTip ? index + 1 : item.step}.
            </span>
            <span>{isTip ? item : item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const InstructionList = ({ description }) => {
  const { setup, movement, breathing, tips } = description;

  return (
    <div className={styles.container}>
      <InstructionSection title="준비" items={setup} />
      <InstructionSection title="움직임" items={movement} />
      <InstructionSection title="호흡법" items={breathing} />
      <InstructionSection title="팁" items={tips} isTip={true} />
    </div>
  );
};

export default InstructionList;
