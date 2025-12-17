import { usePostCreate } from "../../hooks/usePostCreate";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/common/Button";
import SelectBox from "../../components/ui/Community/SelectBox";
import PageHeader from "../../components/common/PageHeader";
import training_icon from "../../assets/images/training_icon.svg";
import "./PostCreatePage.css";
import GoalSelectionPanel from "../../components/ui/Community/GoalSelectionPanel";
import { useParams } from "react-router-dom";
import { usePostDetail } from "../../hooks/usePostDetail";

const BOARD_TYPE_OPTIONS = [
  { value: "free", label: "자유게시판" },
  { value: "exercise", label: "운동게시판" },
];

const PostCreatePage = () => {
  const { postId } = useParams();
  const isEditMode = !!postId;

  const { savePost, isProcessing } = usePostCreate();
  const { navigateWithPanel } = usePersistentPanel();

  const { post: existingPost, loading: fetchingPost } = usePostDetail(postId);

  // 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardType, setBoardType] = useState(BOARD_TYPE_OPTIONS[0].value);

  // 목표 선택 패널 표시 상태
  const [isGoalPanelVisible, setIsGoalPanelVisible] = useState(false);
  // 선택된 목표 ID 저장용
  const [selectedGoal, setSelectedGoal] = useState(null);

  // 수정 모드 데이터세팅
  useEffect(() => {
    if (isEditMode && existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setBoardType(existingPost.boardType);

      // 기존에 연결된 목표가 있다면 selectedGoal 형식에 맞춰 세팅
      if (existingPost.linkedGoal) {
        setSelectedGoal({
          id: existingPost.linkedGoal.id,
          name: existingPost.linkedGoal.name,
          customExercises: existingPost.linkedGoal.exercises,
        });
      }
    }
  }, [isEditMode, existingPost]);

  // 게시글 작성 핸들러
  const handleSubmit = useCallback(async () => {
    if (isProcessing) return;
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const postData = {
      title,
      content,
      boardType,
      userGoalId:
        selectedGoal && selectedGoal.id !== "manual" ? selectedGoal.id : null,
      manualGoalData:
        selectedGoal && selectedGoal.id === "manual"
          ? {
              name: selectedGoal.name,
              customExercises: selectedGoal.customExercises,
            }
          : null,
    };

    const result = await savePost(postData, postId);

    if (result) {
      alert(
        isEditMode ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다."
      );
      navigateWithPanel(
        isEditMode ? `/community/post/${postId}` : "/community"
      );
    }
  }, [
    title,
    content,
    boardType,
    selectedGoal,
    isProcessing,
    savePost,
    postId,
    isEditMode,
    navigateWithPanel,
  ]);

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    if (isEditMode) {
      navigateWithPanel(`/community/${postId}`);
    } else {
      navigateWithPanel("/community");
    }
  }, [isEditMode, navigateWithPanel, postId]);

  if (isEditMode && fetchingPost) return <div>데이터를 불러오는 중...</div>;

  return (
    <div className="post-create-page-container">
      <div className="post-create-page">
        <header className="post-create-header">
          <div className="header-left">
            <PageHeader
              title={isEditMode ? "글 수정" : "글쓰기"}
              onGoBack={handleBack}
            />
          </div>

          <div className="header-right">
            <Button
              text={isEditMode ? "수정" : "작성"}
              onClick={handleSubmit}
              disabled={isProcessing}
            />
          </div>
        </header>

        <main className="post-create-main">
          <div className="post-create-box">
            <div className="board-type-select-wrap">
              <SelectBox
                options={BOARD_TYPE_OPTIONS}
                value={boardType}
                onChange={(e) => setBoardType(e.target.value)}
              />
            </div>
            {boardType === "exercise" && (
              <div className="feature-options-container">
                <div
                  className="feature-item"
                  onClick={() => setIsGoalPanelVisible(true)}
                >
                  <img
                    className="feature-item-icon"
                    src={training_icon}
                    alt="운동"
                  />
                  <span>
                    {selectedGoal
                      ? `선택됨: ${selectedGoal.name}`
                      : "목표 추가하기"}
                  </span>
                </div>
                {selectedGoal && (
                  <button
                    className="clear-goal-btn"
                    onClick={() => setSelectedGoal(null)}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />

          <textarea
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="content-textarea"
          />
          {isGoalPanelVisible && (
            <div className="goal-panel-wrapper">
              <GoalSelectionPanel
                onClose={() => setIsGoalPanelVisible(false)}
                onSelectFinalGoal={(goal) => {
                  setSelectedGoal(goal);
                  setIsGoalPanelVisible(false);
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PostCreatePage;
