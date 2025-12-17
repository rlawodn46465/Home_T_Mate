import styles from "./ExerciseInfoSection.module.css";
import InstructionList from "./InstructionList";
import MemoArea from "./MemoArea";

const ExerciseInfoSection = ({ description, initialMemo, onMemoSave }) => {
  return (
    <section className={styles.container}>
      <InstructionList description={description} />
      <MemoArea initialMemo={initialMemo} onSave={onMemoSave} />
    </section>
  );
};

export default ExerciseInfoSection;
