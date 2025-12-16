// services/postService.js
const Post = require("../models/Post");
const UserGoal = require("../models/UserGoal");
const Goal = require("../models/Goal"); // Goal 모델 필요
const { BadRequestError, NotFoundError } = require("../utils/errorHandler");

// 게시글 목록 조회 서비스
const getPosts = async (queryData) => {
  const {
    page = 1,
    limit = 10,
    boardType,
    search,
    sort = "latest",
  } = queryData;

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

// 게시글 작성 서비스
const createPost = async (userId, postData) => {
  const { title, content, boardType, userGoalId } = postData;

  // 1. 필수 값 검증
  if (!title || !content || !boardType) {
    throw new BadRequestError("제목, 내용, 게시판 종류는 필수입니다.");
  }

  let linkedGoalId = null;

  // 2. 목표 공유 로직 (userGoalId가 넘어왔을 경우)
  if (userGoalId) {
    const userGoal = await UserGoal.findById(userGoalId).populate("goalId");

    if (!userGoal) {
      throw new NotFoundError("공유하려는 목표 정보를 찾을 수 없습니다.");
    }

    // 본인의 목표인지 확인
    if (userGoal.userId.toString() !== userId.toString()) {
      throw new BadRequestError("본인의 목표만 공유할 수 있습니다.");
    }

    // CASE A: 사용자가 루틴을 커스텀(수정)해서 사용 중인 경우
    // -> 수정된 내용을 바탕으로 새로운 Goal(스냅샷)을 생성하여 공유
    if (userGoal.isModified) {
      const newSnapshotGoal = await Goal.create({
        creatorId: userId,
        name: `${title} (공유된 루틴)`, // 혹은 userGoal.goalId.name + " 커스텀"
        goalType: userGoal.goalId.goalType, // 원본 타입 유지
        durationWeek: userGoal.durationWeek,
        parts: userGoal.goalId.parts, // 운동 부위는 재계산하거나 원본 유지
        isUserPublic: true, // 공유 목적이므로 공개
        isBoardPublic: true,

        // 중요: 커스텀된 운동 목록을 Goal 형식으로 변환하여 저장
        exercises: userGoal.customExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          targetMuscles: [], // 필요 시 populate해서 채워야 함 (지금은 생략 가능)
          days: ex.days,
          restTime: ex.restTime,
          sets: ex.sets,
        })),
      });

      linkedGoalId = newSnapshotGoal._id;
    }
    // CASE B: 원본 그대로 사용 중인 경우
    // -> 원본 Goal ID를 그대로 연결
    else {
      linkedGoalId = userGoal.goalId._id;
    }
  }

  // 3. 게시글 생성
  const newPost = await Post.create({
    author: userId,
    title,
    content,
    boardType,
    linkedGoal: linkedGoalId, // 공유할 목표 ID (없으면 null)
    shareCount: 0,
    images: postData.images || [], // 이미지 배열이 있다면 저장
  });

  return newPost;
};

// 게시글 상세 조회
const getPostDetail = async (postId, userId) => {
  const post = await Post.findById(postId)
    .populate({
      path: "author",
      select: "nickname name details.themMode",
    })
    .populate({
      path: "linkedGoal",
      select: "name goalType durationWeek parts exercises downloadCount",
    });

  if (!post) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  // 조회수 증가
  post.viewCount += 1;
  await post.save();

  const isLiked = post.likes.some(
    (likeUserId) => likeUserId.toString() === userId.toString()
  );

  return {
    id: post._id,
    title: post.title,
    content: post.content,
    boardType: post.boardType,
    createdAt: post.createdAt,

    author: {
      id: post.author._id,
      nickname: post.author.nickname,
    },

    viewCount: post.viewCount,
    likeCount: post.likes.length,
    isLiked,

    images: post.images,

    linkedGoal: post.linkedGoal
      ? {
          id: post.linkedGoal._id,
          name: post.linkedGoal.name,
          goalType: post.linkedGoal.goalType,
          durationWeek: post.linkedGoal.durationWeek,
          parts: post.linkedGoal.parts,
          exercises: post.linkedGoal.exercises,
          downloadCount: post.linkedGoal.downloadCount,
        }
      : null,
  };
};

// 게시글 좋아요
const toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  const likedIndex = post.likes.findIndex(
    (id) => id.toString() === userId.toString()
  );

  let isLiked;

  if (likedIndex === -1) {
    post.likes.push(userId);
    isLiked = true;
  } else {
    post.likes.splice(likedIndex, 1);
    isLiked = false;
  }

  await post.save();

  return {
    postId: post._id,
    isLiked,
    likeCount: post.likes.length,
  };
};

// 목표 다운로드
const downloadGoalFromPost = async (postId, userId) => {
  const post = await Post.findById(postId).populate("linkedGoal");

  if (!post) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  if (!post.linkedGoal) {
    throw new BadRequestError("공유된 목표가 없는 게시글입니다.");
  }

  const goal = post.linkedGoal;

  // 이미 가져간 목표인지 체크
  const alreadyDownloaded = await UserGoal.findOne({
    userId,
    goalId: goal._id,
  });

  if (alreadyDownloaded) {
    throw new BadRequestError("이미 가져간 목표입니다.");
  }

  // UserGoal 생성
  const userGoal = await UserGoal.create({
    userId,
    goalId: goal._id,
    durationWeek: goal.durationWeek,
    status: "진행중",
  });

  // Goal 다운로드 수 증가
  goal.downloadCount += 1;
  await goal.save();

  // Post 공유 횟수 증가
  post.shareCount += 1;
  await post.save();

  return {
    userGoalId: userGoal._id,
    goalId: goal._id,
    goalName: goal.name,
    message: "운동 목표를 내 루틴으로 가져왔습니다.",
  };
};

// 게시글 수정
const updatePost = async (postId, userId, data) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new BadRequestError("수정 권한이 없습니다.");
  }

  const { title, content, images } = data;

  if (title) post.title = title;
  if (content) post.content = content;
  if (images) post.images = images;

  await post.save();

  return {
    postId: post._id,
    message: "게시글이 수정되었습니다.",
  };
};

// 게시글 삭제
const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new BadRequestError("삭제 권한이 없습니다.");
  }

  await post.deleteOne();
};

module.exports = {
  getPosts,
  createPost,
  getPostDetail,
  toggleLike,
  downloadGoalFromPost,
  updatePost,
  deletePost,
};
