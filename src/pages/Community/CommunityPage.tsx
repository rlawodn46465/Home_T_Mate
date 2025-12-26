import { useCallback } from "react";
import Button from "../../components/common/Button";
import CommunityList from "../../components/ui/Community/CommunityList";
import CommunityControls from "../../components/ui/Community/CommunityControls";
import { usePosts } from "../../hooks/usePosts";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import { useAuth } from "../../hooks/useAuth";

import styles from "./CommunityPage.module.css";

interface QueryParams {
  boardType?: "free" | "exercise" | null;
  search?: string;
  sortBy?: string;
  page?: number;
}

const CommunityPage = () => {
  const { isAuthenticated } = useAuth();
  const { navigateWithPanel } = usePersistentPanel();

  // 게시판 타입 초기값 (null일 경우 전체 조회)
  const initialBoardType = null;

  // 게시글 관련 커스텀 훅
  const { posts, pagination, isLoading, error, queryParams, setQueryParams } =
    usePosts({ boardType: initialBoardType });

  // 필터, 검색, 정렬 조건 변경 시 호출
  const handleFilterChange = (newFilters: Partial<QueryParams>) => {
    setQueryParams(newFilters);
  };

  // 페이지네이션 번호 변경 시 호출
  const handlePageChange = (newPage: number) => {
    setQueryParams({ page: newPage });
  };

  // 글쓰기 페이지로 이동
  const handleWriteClick = () => {
    navigateWithPanel("/community/write");
  };

  // 게시글 상세 페이지로 이동
  const handlePostClick = useCallback(
    (postId) => {
      navigateWithPanel(`/community/${postId}`);
    },
    [navigateWithPanel]
  );

  return (
    <div className={styles.communityContainer}>
      <div className={styles.header}>
        <h2>게시판</h2>
        {isAuthenticated && (
          <Button text={"글쓰기"} onClick={handleWriteClick} />
        )}
      </div>

      <CommunityControls
        currentQueryParams={queryParams}
        onFilterChange={handleFilterChange}
      />

      <CommunityList
        posts={posts}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={handlePageChange}
        onItemClick={handlePostClick}
      />
    </div>
  );
};

export default CommunityPage;
