import Button from "../../components/common/Button";
import CommunityList from "../../components/ui/Community/CommunityList";
import CommunityControls from "../../components/ui/Community/CommunityControls";
import { usePosts } from "../../hooks/usePosts";
import "./CommunityPage.css";

const CommunityPage = () => {
  const initialBoardType = null;

  const { posts, pagination, isLoading, error, queryParams, setQueryParams } =
    usePosts({ boardType: initialBoardType });

  // 필터/검색/정렬 변경 핸들러
  const handleFilterChange = (newFilters) => {
    setQueryParams(newFilters);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setQueryParams({ page: newPage });
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <h2>게시판</h2>
        <Button text={"글쓰기"} />
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
      />
    </div>
  );
};

export default CommunityPage;
