import { useState, useEffect } from "react";
import input_icon from "../../../assets/images/input_icon.svg";
import styles from "./CommunityControls.module.css";

const TAG_DATA = [
  { id: 1, text: "전체", boardType: null },
  { id: 2, text: "자유게시판", boardType: "free" },
  { id: 3, text: "운동게시판", boardType: "exercise" },
];

const CommunityControls = ({ currentQueryParams, onFilterChange }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchText, setSearchText] = useState(currentQueryParams.search || "");

  // 외부 검색어 변경 시 동기화
  useEffect(() => {
    setSearchText(currentQueryParams.search || "");
  }, [currentQueryParams.search]);

  // 카테고리 태그 클릭 처리
  const handleTagClick = (boardType) => {
    onFilterChange({ boardType, page: 1 });
  };

  // 검색 실행 처리
  const handleSearchTrigger = () => {
    onFilterChange({ search: searchText, page: 1 });
  };

  return (
    <>
      <div className={`${styles.inputContainer} ${isInputFocused ? styles.focused : ""}`}>
        <div className={styles.inputIcon}>
          <img src={input_icon} alt="검색 아이콘" />
        </div>
        <input
          className={styles.inputField}
          placeholder="제목 또는 내용 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchTrigger()}
        />
        <button className={styles.searchSubmitBtn} onClick={handleSearchTrigger}>
          검색
        </button>
      </div>

      <div className={styles.tagContainer}>
        {TAG_DATA.map((tag) => (
          <CommunityTag
            key={tag.id}
            text={tag.text}
            isActive={currentQueryParams.boardType === tag.boardType}
            onClick={() => handleTagClick(tag.boardType)}
          />
        ))}
      </div>
    </>
  );
};

// 내부 사용 태그 컴포넌트
const CommunityTag = ({ text, isActive, onClick }) => (
  <div 
    className={`${styles.tag} ${isActive ? styles.tagActive : ""}`} 
    onClick={onClick}
  >
    {text}
  </div>
);

export default CommunityControls;