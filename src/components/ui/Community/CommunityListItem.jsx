import user_icon from "../../../assets/images/user_icon.svg";
import comments_icon from "../../../assets/images/comments_icon.svg";
import heart_icon from "../../../assets/images/heart_icon.svg";
import training_icon from "../../../assets/images/training_icon.svg";

import styles from "./CommunityListItem.module.css";

const CommunityListItem = ({
  tagText,
  title,
  user,
  commentCount,
  goal,
  like,
  date,
  onClick,
}) => {
  return (
    <div className={styles.item} onClick={onClick}>
      <p className={styles.category}>{tagText}</p>

      <div className={styles.contentWrap}>
        <div className={styles.mainInfo}>
          <h4 className={styles.title}>{title}</h4>
          <ul className={styles.metaList}>
            <li className={styles.metaItem}>
              <img src={user_icon} alt="작성자" className={styles.icon} />
              <p className={styles.iconText}>{user}</p>
            </li>
            <li className={styles.metaItem}>
              <img src={comments_icon} alt="댓글" className={styles.icon} />
              <p className={styles.iconText}>{commentCount}</p>
            </li>
            {goal && (
              <li className={styles.metaItem}>
                <img
                  src={training_icon}
                  alt="목표 포함"
                  className={styles.icon}
                />
              </li>
            )}
          </ul>
        </div>

        <div className={styles.extraInfo}>
          <div className={styles.likes}>
            <img src={heart_icon} alt="좋아요" className={styles.icon} />
            <p className={styles.iconText}>{like}</p>
          </div>
          <p className={styles.date}>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityListItem;
