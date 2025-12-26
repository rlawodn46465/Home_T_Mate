import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../common/Button";
import styles from "./GoalsHeader.module.css";

const GoalsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddGoalClick = () => {
    navigate(`${location.pathname}?panel=goals-form`);
  };

  return (
    <div className={styles.goalHeader}>
      <h2>목표</h2>
      <Button text={"+ 목표 추가"} onClick={handleAddGoalClick} />
    </div>
  );
};

export default GoalsHeader;
