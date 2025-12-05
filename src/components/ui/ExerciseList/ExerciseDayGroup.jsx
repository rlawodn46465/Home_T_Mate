import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ExerciseCard from "../../common/ExerciseCard";
import "./ExerciseDayGroup.css";

const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "yyyy년 M월 dd일", { locale: ko });
};

const ExerciseDayGroup = ({ date, records }) => {
  return (
    <section className="exercise-day-group">
      <h3 className="day-header">{formatDisplayDate(date)}</h3>
      <div className="day-records-container">
        {records.map((record) => (
          <ExerciseCard key={record.id} record={record} />
        ))}
      </div>
    </section>
  );
};

export default ExerciseDayGroup;