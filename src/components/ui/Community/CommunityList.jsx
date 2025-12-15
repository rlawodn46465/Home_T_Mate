import CommunityListItem from "./CommunityListItem";
import "./CommunityList.css";
import Pagination from "./Pagination";

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
}) => {
  // const listItem = [
  //   {
  //     id: 1,
  //     tag: 2,
  //     title: "맨몸 운동 3분할 루틴",
  //     user: "나님",
  //     commentCount: 2,
  //     goal: false,
  //     like: 2,
  //     date: "2025-09-10 14:32",
  //   },
  //   {
  //     id: 2,
  //     tag: 3,
  //     title: "맨몸 운동 3분할 루틴",
  //     user: "나님",
  //     commentCount: 2,
  //     goal: false,
  //     like: 2,
  //     date: "2025-09-10 14:32",
  //   },
  //   {
  //     id: 3,
  //     tag: 2,
  //     title: "맨몸 운동 3분할 루틴",
  //     user: "나님",
  //     commentCount: 2,
  //     goal: false,
  //     like: 2,
  //     date: "2025-09-10 14:32",
  //   },
  //   {
  //     id: 4,
  //     tag: 3,
  //     title: "맨몸 운동 3분할 루틴",
  //     user: "나님",
  //     commentCount: 2,
  //     goal: true,
  //     like: 2,
  //     date: "2025-09-10 14:32",
  //   },
  //   {
  //     id: 5,
  //     tag: 2,
  //     title: "맨몸 운동 3분할 루틴",
  //     user: "나님",
  //     commentCount: 2,
  //     goal: false,
  //     like: 2,
  //     date: "2025-09-10 14:32",
  //   },
  // ];

  if (isLoading) {
    return <div className="loading-indicator">게시글 로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="error-message">데이터를 불러오는 데 실패했습니다.</div>
    );
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
        />
      ))}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default CommunityList;
