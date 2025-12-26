import type { ExerciseMaster } from "../../../types/exercise";
import styles from "./InstructionList.module.css";

type InstructionItem = { step: number; text: string };

interface InstructionSectionProps {
  title: string;
  items: InstructionItem[] | string[] | undefined;
  isTip?: boolean;
}

interface InstructionListProps {
  description: NonNullable<ExerciseMaster["description"]>;
}

const InstructionSection = ({
  title,
  items,
  isTip = false,
}: InstructionSectionProps) => {
  if (!items || items.length === 0) return null;

  const firstItem = items[0];
  if (
    typeof firstItem === "object" &&
    firstItem !== null &&
    "text" in firstItem
  ) {
    if (firstItem.text === "") return null;
  } else if (typeof firstItem === "string" && firstItem === "") {
    return null;
  }

  return (
    <div className={styles.section}>
      <h4>{title}</h4>
      <ul className={styles.list}>
        {items.map((item, index) => {
          const stepValue = isTip ? index + 1 : (item as InstructionItem).step;
          const textValue = isTip
            ? (item as string)
            : (item as InstructionItem).text;

          return (
            <li key={index} className={styles.item}>
              <span className={styles.stepNumber}>{stepValue}.</span>
              <span>{textValue}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const InstructionList = ({ description }: InstructionListProps) => {
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
