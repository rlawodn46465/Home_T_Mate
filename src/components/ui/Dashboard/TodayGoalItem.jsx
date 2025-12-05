import "./TodayGoalItem.css";

const TodayGoalItem = ({ text }) => {
  return <li className="today-goal-item">{text}</li>;
};

export default TodayGoalItem;