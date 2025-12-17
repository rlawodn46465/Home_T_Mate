import styles from "./BodyPartFilter.module.css";

const BodyPartFilter = ({ parts, activePart, onPartChange }) => {
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
