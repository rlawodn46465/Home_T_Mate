import "./CommunityListItem.css";
import user_icon from "../../../assets/images/user_icon.svg";
import comments_icon from "../../../assets/images/comments_icon.svg";
import heart_icon from "../../../assets/images/heart_icon.svg";
import training_icon from "../../../assets/images/training_icon.svg";

const TAG_MAP = {
  2: "자유게시판",
  3: "운동게시판",
};

const CommunityListItem = ({
  tag,
  title,
  user,
  commentCount,
  routine,
  like,
  date,
}) => {
  const tagText = TAG_MAP[tag] || "카테고리 없음";

  return (
    <div className="community-list-item">
      <p className="community-list-item__category">{tagText}</p>
      <div className="community-list-item__content-wrap">
        <div className="community-list-item__main-info">
          <h4 className="community-list-item__title">{title}</h4>
          <ul className="community-list-item__meta-list">
            <li className="community-list-item__meta-item">
              <img
                src={user_icon}
                alt="작성자 아이콘"
                className="community-list-item__icon"
              />
              <p className="community-list-item__icon-text">{user}</p>
            </li>
            <li className="community-list-item__meta-item">
              <img
                src={comments_icon}
                alt="댓글 아이콘"
                className="community-list-item__icon"
              />
              <p className="community-list-item__icon-text">{commentCount}</p>
            </li>
            {routine && (
              <li className="community-list-item__meta-item">
                <img
                  src={training_icon}
                  alt="루틴 아이콘"
                  className="community-list-item__icon"
                />
              </li>
            )}
          </ul>
        </div>
        <div className="community-list-item__extra-info">
          <div className="community-list-item__likes">
            <img
              src={heart_icon}
              alt="좋아요 아이콘"
              className="community-list-item__icon"
            />
            <p className="community-list-item__icon-text">{like}</p>
          </div>
          <p className="community-list-item__date">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityListItem;
