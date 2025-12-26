import styles from "./BodyPartFilter.module.css";

interface BodyPartFilterProps {
  parts: string[];
  activePart: string;
  onPartChange: (part: string) => void;
}

const BodyPartFilter = ({
  parts,
  activePart,
  onPartChange,
}: BodyPartFilterProps) => {
  return (
    <div className={styles.bodyPartFilterScroll}>
      <div className={styles.bodyPartFilter}>
        {parts.map((part) => (
          <button
            key={part}
            className={`${styles.filterButton} ${
              activePart === part ? styles.active : ""
            }`}
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
