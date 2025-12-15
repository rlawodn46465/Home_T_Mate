import { useState, useEffect } from "react";
import CommunityTag from "./CommunityTag";
import input_icon from "../../../assets/images/input_icon.svg";

const tagData = [
  { id: 1, text: "전체", boardType: null },
  { id: 2, text: "자유게시판", boardType: "free" },
  { id: 3, text: "운동게시판", boardType: "exercise" },
];

const CommunityControls = ({ currentQueryParams, onFilterChange }) => {
  const getInitialTagId = (boardType) => {
    const foundTag = tagData.find((t) => t.boardType === boardType);
    return foundTag ? foundTag.id : 1;
  };

  const initialTagId = getInitialTagId(currentQueryParams.boardType);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(initialTagId);
  const [searchText, setSearchText] = useState(currentQueryParams.search || "");

  useEffect(() => {
    setSearchText(currentQueryParams.search || "");
    const currentTag =
      tagData.find((t) => t.boardType === currentQueryParams.boardType) ||
      tagData[0];
    setSelectedTagId(currentTag.id);
  }, [currentQueryParams.search, currentQueryParams.boardType]);

  // 태그 클릭 핸들러: boardType 변경
  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId);

    const selectedTag = tagData.find((tag) => tag.id === tagId);
    const type = selectedTag && selectedTag.boardType;

    onFilterChange({ boardType: type });
  };

  // 검색 핸들러: search 쿼리 변경
  const handleSearch = () => {
    onFilterChange({ search: searchText });
  };

  return (
    <>
      {/* 검색 입력 섹션 */}
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
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch}>
          <img src={input_icon} alt="검색 버튼" />
        </button>
      </div>

      {/* 태그 필터 섹션 */}
      <div className="community-tag-container">
        {tagData.map((tag) => (
          <CommunityTag
            key={tag.id}
            text={tag.text}
            isActive={selectedTagId === tag.id}
            onClick={() => handleTagClick(tag.id)}
          />
        ))}
      </div>
    </>
  );
};

export default CommunityControls;
