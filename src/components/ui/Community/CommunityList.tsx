import CommunityListItem from "./CommunityListItem";
import Pagination from "./Pagination";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";
import styles from "./CommunityList.module.css";
import type {
  PostListItem,
  Pagination as PaginationType,
  BoardType,
} from "../../../types/post";

interface CommunityListProps {
  posts: PostListItem[];
  pagination: PaginationType;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onItemClick: (postId: string) => void;
}

// 게시판 타입을 텍스트로 변환하기 위한 맵핑 (상수)
const TAG_MAP: Record<BoardType, string> = {
  free: "자유게시판",
  exercise: "운동게시판",
};

const CommunityList = ({
  posts,
  pagination,
  isLoading,
  error,
  onPageChange,
  onItemClick,
}: CommunityListProps) => {
  // 로딩 상태 처리
  if (isLoading) {
    return <Spinner text={"게시글 로딩 중..."} />;
  }

  // 에러 상태 처리
  if (error) {
    return <ErrorMessage message="데이터를 불러오는 데 실패했습니다." />;
  }

  // 데이터가 없을 때 처리
  if (!posts || posts.length === 0) {
    return (
      <div className={styles.noData}>
        등록된 게시글이 없거나, 검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {posts.map((item) => (
        <CommunityListItem
          key={item.id}
          tagText={TAG_MAP[item.boardType] || "카테고리 없음"}
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