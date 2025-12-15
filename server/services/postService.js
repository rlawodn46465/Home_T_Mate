// services/postService.js
const Post = require("../models/Post");

// 게시글 목록 조회 서비스
const getPosts = async (queryData) => {
  const { page = 1, limit = 10, boardType, search, sort = "latest" } = queryData;

  // 1. 기본 쿼리 조건 설정
  const query = {};

  // 게시판 종류 필터 (전체보기일 경우 boardType이 없을 수 있음)
  if (boardType && ["free", "exercise"].includes(boardType)) {
    query.boardType = boardType;
  }

  // 검색 조건 (제목 + 내용)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } }, // 대소문자 무시 부분 일치
      { content: { $regex: search, $options: "i" } },
    ];
  }

  // 2. 정렬 조건 설정
  let sortOption = { createdAt: -1 }; // 기본: 최신순
  if (sort === "likes") {
    sortOption = { createdAt: -1 }; 
  }

  // 3. 페이지네이션 계산
  const skip = (page - 1) * limit;

  // 4. DB 조회 (병렬 처리로 성능 최적화)
  const [posts, totalCount] = await Promise.all([
    Post.find(query)
      .populate({
        path: "author",
        select: "nickname name details.themMode", // 작성자 닉네임, 이름 등 필요한 정보만
      })
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean(), // 조회 성능 향상을 위해 lean() 사용 (mongoose 문서가 아닌 JS 객체 반환)
    
    Post.countDocuments(query), // 전체 개수 (페이지 계산용)
  ]);

  // 5. 데이터 가공 (프론트엔드에서 보여주기 편하게)
  const formattedPosts = posts.map((post) => ({
    id: post._id,
    title: post.title,
    content: post.content.substring(0, 100) + "...", // 미리보기용 내용 자르기
    author: post.author ? post.author.nickname : "알 수 없음",
    boardType: post.boardType,
    createdAt: post.createdAt,
    
    // UI 표시용 숫자들
    viewCount: post.viewCount,
    likeCount: post.likes ? post.likes.length : 0, // 좋아요 수
    commentCount: post.commentCount, // 댓글 수 (모델에 캐싱된 값 사용)
    shareCount: post.shareCount, // 공유 횟수
    
    // 목표 공유 여부 확인
    hasGoal: !!post.linkedGoal, 
  }));

  return {
    posts: formattedPosts,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      limit: Number(limit),
    },
  };
};

module.exports = {
  getPosts,
};