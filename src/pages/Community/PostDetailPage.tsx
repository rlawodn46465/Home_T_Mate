import { useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import { usePostDetail, useGoalDownload } from "../../hooks/usePosts";
import { useComments } from "../../hooks/useComments";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import PageHeader from "../../components/common/PageHeader";
import CommentList from "../../components/ui/Community/CommentList";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { fetchPostsThunk } from "../../store/slices/postSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";

interface HeartIconProps {
  filled: boolean;
}

const HeartIcon = ({ filled }: HeartIconProps) => (
  <span
    style={{
      color: filled ? "#ff4d4f" : "#aaa",
      fontSize: "1.2rem",
      cursor: "pointer",
    }}
  >
    {filled ? "♥" : "♡"}
  </span>
);

const PostDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { postId } = useParams<{ postId: string }>();
  const { navigateWithPanel } = usePersistentPanel();
  const { user } = useAuth();
  const {
    post,
    loading,
    error,
    handleToggleLike,
    handleDeletePost,
    removeLoading,
  } = usePostDetail(postId);
  const { handleDownload, isDownloading } = useGoalDownload();

  const [newCommentContent, setNewCommentContent] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const {
    comments,
    loading: commentsLoading,
    create,
    remove,
  } = useComments(postId);

  const isAuthor = post?.author?.id === user?.id;

  // 댓글 작성 로직 통합
  const onSubmitComment = async () => {
    const success = await create(newCommentContent);
    if (success) setNewCommentContent("");
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // 삭제 핸들러
  const handleDeleteWithConfirm = async () => {
    const confirmed = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await handleDeletePost();
      alert("삭제되었습니다.");
      dispatch(fetchPostsThunk());
      navigateWithPanel("/community");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!post) return null;

  return (
    <div className={styles.container}>
      <PageHeader
        title="게시판"
        onGoBack={() => navigateWithPanel("/community")}
      />

      <div className={styles.contentArea}>
        <header>
          <div className={styles.category}>
            {post.boardType === "free" ? "자유게시판" : "운동게시판"}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.metaInfo}>
            <div className={styles.metaLeft}>
              <span className={styles.authorIcon}>👤</span>
              <span className={styles.authorName}>
                {post.author?.nickname || "알 수 없는 사용자"}
              </span>
            </div>
            <div className={styles.metaRight}>
              <span>조회수 : {post.viewCount}</span>
              <time className={styles.metaDate}>
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>
        </header>

        <hr />

        <article className={styles.postBody}>
          {post.images?.length > 0 && (
            <div className={styles.postImages}>
              {post.images.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`첨부이미지 ${idx + 1}`} />
              ))}
            </div>
          )}
          <p className={styles.postText}>{post.content}</p>

          {post.linkedGoal && (
            <section className={styles.linkedGoalCard}>
              <div
                className={`${styles.goalBadge} ${
                  styles[post.linkedGoal.goalType.toLowerCase()]
                }`}
              >
                {post.linkedGoal.goalType === "ROUTINE" ? "루틴" : "챌린지"}
              </div>
              <h3>{post.linkedGoal.name}</h3>
              <p>📂 {post.linkedGoal.downloadCount}회 저장됨</p>
              <button
                type="button"
                className={styles.downloadBtn}
                disabled={isDownloading}
                onClick={() => handleDownload(post.id)}
              >
                {isDownloading ? "가져오는 중..." : "🔥 이 루틴 내 목록에 담기"}
              </button>
            </section>
          )}
        </article>

        {isAuthor && (
          <div className={styles.actionButtons}>
            <Button
              text="수정"
              onClick={() => navigateWithPanel(`/community/edit/${postId}`)}
            />
            <Button
              text={removeLoading ? "삭제 중..." : "삭제"}
              onClick={handleDeleteWithConfirm}
              disabled={removeLoading}
            />
          </div>
        )}

        <div className={styles.likeSection}>
          <button className={styles.likeButton} onClick={handleToggleLike}>
            <HeartIcon filled={post.isLiked} />
            <span className={styles.likeCount}>{post.likeCount}</span>
          </button>
        </div>

        <hr className={styles.divider} />

        <section className={styles.commentSection}>
          <div className={styles.commentInputBox}>
            <textarea
              placeholder={isInputFocused ? "" : "댓글을 입력해주세요"}
              value={newCommentContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNewCommentContent(e.target.value)
              }
              onFocus={() => setIsInputFocused(true)}
              onBlur={() =>
                !newCommentContent.trim() && setIsInputFocused(false)
              }
            />
            <div className={styles.submitWrapper}>
              <button
                className={styles.submitBtn}
                onClick={onSubmitComment}
                disabled={!newCommentContent.trim()}
              >
                글쓰기
              </button>
            </div>
          </div>

          <CommentList
            comments={comments}
            isLoading={commentsLoading}
            onDelete={remove}
          />
        </section>
      </div>
    </div>
  );
};

export default PostDetailPage;
