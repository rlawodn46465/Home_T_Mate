import { useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import { usePostDetail, useGoalDownload } from "../../hooks/usePosts";
import { useComments } from "../../hooks/useComments";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import PageHeader from "../../components/common/PageHeader";
import CommentList from "../../components/ui/Community/CommentList";
import Button from "../../components/common/Button";

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
  const { postId } = useParams<{ postId: string }>();
  const { navigateWithPanel } = usePersistentPanel();
  const { handleDownload, isDownloading } = useGoalDownload();
  const { post, loading, error, isAuthor, handleToggleLike, handleDeletePost } =
    usePostDetail(postId);

  const [newCommentContent, setNewCommentContent] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const {
    comments,
    loading: commentsLoading,
    create,
    remove,
  } = useComments(postId);

  // 댓글 작성 로직 통합
  const onSubmitComment = async () => {
    const success = await create(newCommentContent);
    if (success) setNewCommentContent("");
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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

        <hr className={styles.divider} />

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
                onClick={() => handleDownload(post.id, post.linkedGoal.name)}
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
            <Button text="삭제" onClick={handleDeletePost} />
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
