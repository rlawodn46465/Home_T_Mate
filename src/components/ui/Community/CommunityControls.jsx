import { useState, useEffect } from "react";
import CommunityTag from "./CommunityTag";
import input_icon from "../../../assets/images/input_icon.svg";

const tagData = [
  { id: 1, text: "전체", boardType: null },
  { id: 2, text: "자유게시판", boardType: "free" },
  { id: 3, text: "운동게시판", boardType: "exercise" },
];

const CommunityControls = ({ currentQueryParams, onFilterChange }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchText, setSearchText] = useState(currentQueryParams.search || "");

  // 외부에서 검색어가 초기화 되거나 변경될 때 동기화
  useEffect(() => {
    setSearchText(currentQueryParams.search || "");
  }, [currentQueryParams.search]);

  // 즉시 필터링 적용
  const handleTagClick = (tag) => {
    onFilterChange({
      boardType: tag.boardType,
      page: 1,
    });
  };

  // 실제 검색 수행 함수
  const handleSearchTrigger = () => {
    onFilterChange({
      search: searchText,
      page: 1,
    });
  };

  return (
    <>
      <div
        className={`community-input-container ${
          isInputFocused ? "focused" : ""
        }`}
      >
        <div className="community-input-icon">
          <img src={input_icon} alt="검색" />
        </div>
        <input
          className="community-input"
          placeholder="제목 또는 내용 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchTrigger();
          }}
        />
        <button className="search-submit-btn" onClick={handleSearchTrigger}>
          검색
        </button>
      </div>

      <div className="community-tag-container">
        {tagData.map((tag) => (
          <CommunityTag
            key={tag.id}
            text={tag.text}
            isActive={
              (tag.boardType === null &&
                currentQueryParams.boardType === null) ||
              tag.boardType === currentQueryParams.boardType
            }
            onClick={() => handleTagClick(tag)}
          />
        ))}
      </div>
    </>
  );
};

export default CommunityControls;
