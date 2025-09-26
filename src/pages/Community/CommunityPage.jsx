import Button from "../../components/common/Button";
import "./CommunityPage.css";
import input_icon from "../../assets/images/input_icon.svg";
import { useState } from "react";
import CommunityTag from "../../components/ui/Community/CommunityTag";
import CommunityList from "../../components/ui/Community/CommunityList";

const tagData = [
  { id: 1, text: "전체" },
  { id: 2, text: "자유게시판" },
  { id: 3, text: "운동게시판" },
];

const CommunityPage = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedTag, setSelectedTag] = useState(1);

  return (
    <div className="community-container">
      <div className="community-header">
        <h2>게시판</h2>
        <Button text={"글쓰기"} />
      </div>
      <div
        className={`community-input-container ${
          isInputFocused ? "focused" : ""
        }`}
      >
        <div className="community-input-icon">
          <img src={input_icon} />
        </div>
        <input
          className="community-input"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <button>
          <img src={input_icon} />
        </button>
      </div>
      <div className="community-tag-container">
        {tagData.map((tag) => (
          <CommunityTag
            key={tag.id}
            text={tag.text}
            isActive={selectedTag == tag.id}
            onClick={()=> setSelectedTag(tag.id)}
          />
        ))}
      </div>
      <CommunityList/>
    </div>
  );
};

export default CommunityPage;
