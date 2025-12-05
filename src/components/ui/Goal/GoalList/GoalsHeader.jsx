import "./GoalsHeader.css";
import Button from "../../../common/Button";
import { useLocation, useNavigate } from "react-router-dom";

const GoalsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleAddGoalClick = () => {
    navigate(`${location.pathname}?panel=goals-form`);
  };
  return (
    <div className="goal-header">
      <h2>루틴</h2>
      <Button text={"+ 루틴 추가"} onClick={handleAddGoalClick} />
    </div>
  );
};

export default GoalsHeader;
