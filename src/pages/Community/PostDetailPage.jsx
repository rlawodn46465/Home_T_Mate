import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { usePersistentPanel } from "../../hooks/usePersistentPanel";
import "./PostDetailPage.css";
import { usePostDetail } from "../../hooks/usePostDetail";
import { useCallback, useState } from "react";
import { useComments } from "../../hooks/useComments";
import CommentList from "../../components/ui/Community/CommentList";
import Button from "../../components/common/Button";
import training_icon from "../../assets/images/training_icon.svg";
import { useGoalDownload } from "../../hooks/useGoalDownload";

const HeartIcon = ({ filled }) => (
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
  const { postId } = useParams();
  const { handleDownload, isDownloading } = useGoalDownload();
  const { navigateWithPanel } = usePersistentPanel();
  const { post, loading, error, isAuthor, handleToggleLike, handleDeletePost } =
    usePostDetail(postId);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const {
    comments,
    loading: commentsLoading,
    handleCreateComment,
    handleDeleteComment,
  } = useComments(postId, post?.commentCount);

  // 댓글 작성 로직 통합
  const onSubmitComment = useCallback(async () => {
    if (!newCommentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const success = await handleCreateComment(newCommentContent);

    if (success) {
      setNewCommentContent("");
      setIsInputFocused(false);
    }
  }, [newCommentContent, handleCreateComment]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  if (loading) return <div className="post-detail-loading">로딩 중...</div>;
  if (error) return <div className="post-detail-error">{error}</div>;
  if (!post) return null;

  return (
    <div className="post-detail-container">
      <PageHeader
        title={"게시판"}
        onGoBack={() => navigateWithPanel("/community")}
      />
      <div className="post-detail-content">
        <div className="post-category">
          {post.boardType === "free" ? "자유게시판" : "운동게시판"}
        </div>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta-info">
          <div className="meta-left">
            <span className="author-icon">👤</span>
            <span className="author-name">
              {post.author?.nickname || "알 수 없는 사용자"}
            </span>
          </div>
          <div className="meta-right">
            <span>조회수 : {post.viewCount}</span>
            <span className="meta-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="post-body">
          {post.images && post.images.length > 0 && (
            <div className="post-images">
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt={`post-${idx}`} />
              ))}
            </div>
          )}
          <p className="post-text">{post.content}</p>
          {post.linkedGoal && (
            <div className="linked-goal-card">
              <div className="goal-info-card">
                <div className="goal-header">
                  <div className="goal-title-area">
                    <span
                      className={`goal-badge ${post.linkedGoal.goalType.toLowerCase()}`}
                    >
                      {post.linkedGoal.goalType === "ROUTINE"
                        ? "루틴"
                        : "챌린지"}
                    </span>
                    <h3>{post.linkedGoal.name}</h3>
                  </div>
                  <div className="goal-meta">
                    <span>📂 {post.linkedGoal.downloadCount}회 저장됨</span>
                  </div>
                </div>

                <div className="goal-body">
                  <div className="goal-parts">
                    {post.linkedGoal.parts?.map((part, idx) => (
                      <span key={idx} className="part-tag">
                        #{part}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="download-goal-btn"
                  disabled={isDownloading}
                  onClick={() => handleDownload(post.id, post.linkedGoal.name)}
                >
                  {isDownloading
                    ? "가져오는 중..."
                    : "🔥 이 루틴 내 목록에 담기"}
                </button>
              </div>
            </div>
          )}
        </div>

        {isAuthor && (
          <div className="post-actions-buttons">
            <Button
              text="수정"
              onClick={() => navigateWithPanel(`/community/edit/${postId}`)}
              variant="secondary"
            />
            <Button text="삭제" onClick={handleDeletePost} variant="danger" />
          </div>
        )}

        <div className="post-like-section">
          <button className="like-button" onClick={handleToggleLike}>
            <HeartIcon filled={post.isLiked} />
            <span className="like-count">{post.likeCount}</span>
          </button>
        </div>

        <hr className="divider" />

        <div className="comment-section">
          <div className="comment-input-box">
            <textarea
              placeholder={isInputFocused ? "" : "댓글을 입력해주세요"} // 포커스 시 placeholder 숨기기
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                if (newCommentContent.trim() === "") {
                  setIsInputFocused(false);
                }
              }}
            />
            <div className="comment-submit-wrapper">
              <button
                className="comment-submit-btn"
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
            onDelete={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
