import { memo } from "react";
import styles from "./DateCircle.module.css";

const DateCircle = ({ data }) => {
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
