import CommunityListItem from "./CommunityListItem";
import "./CommunityList.css";
import Pagination from "./Pagination";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";
const TAG_MAP = {
  2: "자유게시판",
  3: "운동게시판",
};

const CommunityList = ({
  posts,
  pagination,
  isLoading,
  error,
  onPageChange,
  onItemClick,
}) => {
  if (isLoading) {
    return <Spinner text={"게시글 로딩 중..."} />;
  }

  if (error) {
    return <ErrorMessage message="데이터를 불러오는 데 실패했습니다." />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="no-data">
        등록된 게시글이 없거나, 검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="community-list-container">
      {posts.map((item) => (
        <CommunityListItem
          key={item.id}
          tag={item.boardType === "free" ? 2 : 3}
          title={item.title}
          user={item.author}
          commentCount={item.commentCount}
          goal={item.hasGoal}
          like={item.likeCount}
          date={new Date(item.createdAt).toLocaleDateString()}
          onClick={() => onItemClick(item.id)}
        />
      ))}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default CommunityList;
