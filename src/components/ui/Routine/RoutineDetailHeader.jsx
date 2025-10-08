import Button from "../../common/Button";
import "./RoutineDetailHeader.css";
import edit_icon from "../../../assets/images/edit_icon.svg";

const RoutineDetailHeader = ({
  title,
  onEdit,
  onGoBack,
  showBackButton = false,
  showEditButton = false,
}) => {
  return (
    <div className="routine-header">
      <h2>{title}</h2>
      <div className="routine-detail-header__menu">
        {showEditButton && (
          <img
            className="routine-detail__edit-icon"
            src={edit_icon}
            onClick={onEdit}
          />
        )}
        {showBackButton && <Button text={"뒤로가기"} onClick={onGoBack} />}
      </div>
      {!showBackButton && !showEditButton && (
        <div style={{ width: "24px" }}></div>
      )}
    </div>
  );
};

export default RoutineDetailHeader;
