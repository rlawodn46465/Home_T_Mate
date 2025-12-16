import { usePostCreate } from "../../hooks/usePostCreate";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import { useCallback, useState } from "react";
import Button from "../../components/common/Button";
import SelectBox from "../../components/ui/Community/SelectBox";
import PageHeader from "../../components/common/PageHeader";
import training_icon from "../../assets/images/training_icon.svg";
import "./PostCreatePage.css";

const BOARD_TYPE_OPTIONS = [
  { value: "free", label: "자유게시판" },
  { value: "exercise", label: "운동게시판" },
];

const PostCreatePage = () => {
  const { createPosting, isCreating } = usePostCreate();
  const { navigateWithPanel } = usePersistentPanel();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardType, setBoardType] = useState(BOARD_TYPE_OPTIONS[0].value);

  const handleSubmit = useCallback(async () => {
    if (isCreating) return;
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const postData = {
      title,
      content,
      boardType,
    };

    const result = await createPosting(postData);

    if (result) {
      alert(result.message || "게시글이 성공적으로 등록되었습니다.");
      navigateWithPanel("/community");
    }
  }, [title, content, boardType, isCreating, createPosting, navigateWithPanel]);

  return (
    <div className="post-create-page-container">
      <div className="post-create-page">
        {/* 상단 헤더: 뒤로가기 / 글쓰기 */}
        <header className="post-create-header">
          <div className="header-left">
            <PageHeader
              title={"글쓰기"}
              onGoBack={() => navigateWithPanel("/community")}
            />
          </div>

          <div className="header-right">
            <Button
              text="글쓰기"
              onClick={handleSubmit}
              disabled={isCreating}
            />
          </div>
        </header>

        {/* 폼 본문 */}
        <main className="post-create-main">
          <div className="post-create-box">
            {/* 게시판 타입 선택 (드롭다운) */}
            <div className="board-type-select-wrap">
              <SelectBox
                options={BOARD_TYPE_OPTIONS}
                value={boardType}
                onChange={(e) => setBoardType(e.target.value)}
              />
            </div>
            {/* 목표 추가 기능*/}
            {boardType === "exercise" && (
              <div className="feature-options">
                <div
                  className="feature-item"
                  onClick={() => alert("루틴 추가 기능")}
                >
                  <img
                    className="feature-item-icon"
                    src={training_icon}
                    alt="운동"
                  />
                  <span>목표 추가하기</span>
                </div>
              </div>
            )}
          </div>

          {/* 제목 입력 */}
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />

          {/* 내용 입력 (반응형을 위해 textarea 사용) */}
          <textarea
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="content-textarea"
          />
        </main>
      </div>
    </div>
  );
};

export default PostCreatePage;
