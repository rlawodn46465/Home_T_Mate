import "./RoutineHeader.css";
import Button from "../../../components/common/Button";
import { useLocation, useNavigate } from "react-router-dom";

const RoutineHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleAddRoutineClick = () => {
    navigate(`${location.pathname}?panel=routine-form`);
  };
  return (
    <div className="routine-header">
      <h2>루틴</h2>
      <Button text={"+ 루틴 추가"} onClick={handleAddRoutineClick} />
    </div>
  );
};

export default RoutineHeader;
