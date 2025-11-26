import Button from "../../../common/Button";
import "./RoutineDetailHeader.css";
import edit_icon from "../../../../assets/images/edit_icon.svg";
import delete_icon from "../../../../assets/images/delete_icon.svg";

const RoutineDetailHeader = ({
  title,
  onEdit,
  onGoBack,
  showBackButton = false,
  showEditButton = false,
  onDelete,
}) => {
  return (
    <div className="routine-header">
      <h2>{title}</h2>
      <div className="routine-detail-header__menu">
        {showEditButton && onDelete && (
          <img // 클래스 꾸미기 & 아이콘 추가
            className="routine-detail__icon"
            src={delete_icon}
            onClick={onDelete}
            alt="삭제"
          />
        )}
        {showEditButton && (
          <img
            className="routine-detail__icon"
            src={edit_icon}
            onClick={onEdit}
            alt="수정"
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
