import styles from "./ExerciseInfoSection.module.css";
import InstructionList from "./InstructionList";
import MemoArea from "./MemoArea";
import type { ExerciseMaster } from "../../../types/exercise";

interface ExerciseInfoSectionProps {
  description: ExerciseMaster["description"];
  initialMemo: string;
  onMemoSave: (memo: string) => void;
}

const ExerciseInfoSection = ({
  description,
  initialMemo,
  onMemoSave,
}: ExerciseInfoSectionProps) => {
  if (!description) return null;

  return (
    <section className={styles.container}>
      <InstructionList description={description} />
      <MemoArea initialMemo={initialMemo} onSave={onMemoSave} />
    </section>
  );
};

export default ExerciseInfoSection;
