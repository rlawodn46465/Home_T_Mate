import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import styles from "./ExerciseDayGroup.module.css";
import ExerciseCard from "../../common/ExerciseCard";
import type { ExerciseRecord } from "../../common/ExerciseCard";

interface ExerciseDayGroupProps {
  date: string | Date;
  records: ExerciseRecord[];
  onEdit?: (record: ExerciseRecord) => void;
  onDelete?: (id: string) => void;
}

const ExerciseDayGroup = ({
  date,
  records,
  onEdit,
  onDelete,
}: ExerciseDayGroupProps) => {
  const displayDate = useMemo(() => {
    try {
      const dateObj = typeof date === "string" ? parseISO(date) : date;
      return format(dateObj, "yyyy년 M월 dd일 (EEEE)", { locale: ko });
    } catch (error) {
      return String(date);
    }
  }, [date]);

  return (
    <section className={styles.group}>
      <h3 className={styles.header}>{displayDate}</h3>
      <div className={styles.recordsContainer}>
        {records.map((record, index) => (
          <ExerciseCard
            key={record.id || `${record.date}-${index}`}
            record={record}
            isDetailSelector={true}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default ExerciseDayGroup;
