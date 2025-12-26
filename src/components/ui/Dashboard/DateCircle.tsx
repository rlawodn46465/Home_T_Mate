import { memo } from "react";
import styles from "./DateCircle.module.css";

interface DateCircleData {
  date: number | string;
  isToday: boolean;
  isWorkout: boolean;
}

interface DateCircleProps {
  data: DateCircleData;
}

const DateCircle = ({ data }: DateCircleProps) => {
  const { date, isToday, isWorkout } = data;

  const getCircleClassName = () => {
    const classes = [styles.circle];

    if (isToday) {
      classes.push(styles.today);
    } else if (isWorkout) {
      classes.push(styles.workout);
    }

    return classes.join(" ");
  };

  return (
    <div
      className={getCircleClassName()}
      aria-current={isToday ? "date" : undefined}
    >
      {date}
    </div>
  );
};

export default memo(DateCircle);
