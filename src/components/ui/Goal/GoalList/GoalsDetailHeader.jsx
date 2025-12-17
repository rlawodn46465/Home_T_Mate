import Button from "../../../common/Button";
import styles from "./GoalsDetailHeader.module.css";
import edit_icon from "../../../../assets/images/edit_icon.svg";
import delete_icon from "../../../../assets/images/delete_icon.svg";

const GoalsDetailHeader = ({
  title,
  onEdit,
  onGoBack,
  showBackButton = false,
  showEditButton = false,
  onDelete,
}) => {
  return (
    <div className={styles.goalsHeader}>
      <h2>{title}</h2>
      <div className={styles.goalsDetailHeaderMenu}>
        {showEditButton && onDelete && (
          <img // 클래스 꾸미기 & 아이콘 추가
            className={styles.goalsDetailIcon}
            src={delete_icon}
            onClick={onDelete}
            alt="삭제"
          />
        )}
        {showEditButton && (
          <img
            className={styles.goalsDetailIcon}
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

export default GoalsDetailHeader;
