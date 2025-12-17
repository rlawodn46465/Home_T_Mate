import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePostCreate } from "../../hooks/usePostCreate";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import { usePostDetail } from "../../hooks/usePostDetail";

import Button from "../../components/common/Button";
import SelectBox from "../../components/ui/Community/SelectBox";
import PageHeader from "../../components/common/PageHeader";
import GoalSelectionPanel from "../../components/ui/Community/GoalSelectionPanel";

import training_icon from "../../assets/images/training_icon.svg";
import styles from "./PostCreatePage.module.css";

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

  // 폼 필드 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardType, setBoardType] = useState(BOARD_TYPE_OPTIONS[0].value);
  const [isGoalPanelVisible, setIsGoalPanelVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // 수정 모드 시 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setBoardType(existingPost.boardType);
      if (existingPost.linkedGoal) {
        setSelectedGoal({
          id: existingPost.linkedGoal.id,
          name: existingPost.linkedGoal.name,
          customExercises: existingPost.linkedGoal.exercises,
        });
      }
    }
  }, [isEditMode, existingPost]);

  // 저장 처리 핸들러
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
      userGoalId: selectedGoal?.id !== "manual" ? selectedGoal?.id : null,
      manualGoalData:
        selectedGoal?.id === "manual"
          ? {
              name: selectedGoal.name,
              customExercises: selectedGoal.customExercises,
            }
          : null,
    };

    const result = await savePost(postData, postId);
    if (result) {
      alert(isEditMode ? "수정되었습니다." : "등록되었습니다.");
      navigateWithPanel(isEditMode ? `/community/${postId}` : "/community");
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

  const handleBack = () =>
    navigateWithPanel(isEditMode ? `/community/${postId}` : "/community");

  if (isEditMode && fetchingPost)
    return <div className={styles.loading}>데이터 로드 중...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <PageHeader
              title={isEditMode ? "글 수정" : "글쓰기"}
              onGoBack={handleBack}
            />
          </div>
          <div className={styles.headerRight}>
            <Button
              text={isEditMode ? "수정" : "작성"}
              onClick={handleSubmit}
              disabled={isProcessing}
            />
          </div>
        </header>

        <main>
          <div className={styles.createBox}>
            <div className={styles.selectWrap}>
              <SelectBox
                options={BOARD_TYPE_OPTIONS}
                value={boardType}
                onChange={(e) => setBoardType(e.target.value)}
              />
            </div>

            {boardType === "exercise" && (
              <div className={styles.featureOptionsContainer}>
                <div
                  className={styles.featureItem}
                  onClick={() => setIsGoalPanelVisible(true)}
                >
                  <img
                    className={styles.featureIcon}
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
                    className={styles.clearGoalBtn}
                    onClick={() => setSelectedGoal(null)}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          <input
            className={styles.titleInput}
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className={styles.contentTextarea}
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {isGoalPanelVisible && (
            <div className={styles.goalPanelWrapper}>
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
