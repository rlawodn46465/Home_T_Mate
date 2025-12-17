// services/postService.js
const Post = require("../models/Post");
const UserGoal = require("../models/UserGoal");
const Goal = require("../models/Goal"); // Goal 모델 필요
const { BadRequestError, NotFoundError } = require("../utils/errorHandler");

// 게시글 작성/수정 시 연결된 목표 처리 공통 로직
const processLinkedGoal = async (userId, title, userGoalId, manualGoalData) => {
  let linkedGoalId = null;

  // 기존 목표를 선택하여 공유하는 경우
  if (userGoalId) {
    const userGoal = await UserGoal.findById(userGoalId).populate("goalId");
    if (!userGoal)
      throw new NotFoundError("공유하려는 목표 정보를 찾을 수 없습니다.");
    if (userGoal.userId.toString() !== userId.toString()) {
      throw new BadRequestError("본인의 목표만 공유할 수 있습니다.");
    }

    if (userGoal.isModified) {
      const newSnapshotGoal = await Goal.create({
        creatorId: userId,
        name: `${title} (공유된 루틴)`,
        goalType: userGoal.goalId.goalType,
        durationWeek: userGoal.durationWeek,
        parts: userGoal.goalId.parts,
        isUserPublic: true,
        isBoardPublic: true,
        exercises: userGoal.customExercises,
      });
      linkedGoalId = newSnapshotGoal._id;
    } else {
      linkedGoalId = userGoal.goalId._id;
    }
  }
  // 목표 없이 직접 입력한 경우
  else if (manualGoalData && manualGoalData.customExercises) {
    const allParts = manualGoalData.customExercises.reduce((acc, ex) => {
      return [...acc, ...(ex.targetMuscles || [])];
    }, []);

    const newManualGoal = await Goal.create({
      creatorId: userId,
      name: manualGoalData.name || `${title} (루틴)`,
      goalType: "ROUTINE",
      parts: [...new Set(allParts)],
      isUserPublic: true,
      isBoardPublic: true,
      exercises: manualGoalData.customExercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        targetMuscles: ex.targetMuscles,
        days: ex.days || [],
        restTime: ex.restTime || 60,
        sets: ex.sets,
      })),
    });
    linkedGoalId = newManualGoal._id;
  }

  return linkedGoalId;
};

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
  const { title, content, boardType, userGoalId, manualGoalData } = postData;

  // 필수 값 검증
  if (!title || !content || !boardType) {
    throw new BadRequestError("제목, 내용, 게시판 종류는 필수입니다.");
  }

  const linkedGoalId = await processLinkedGoal(
    userId,
    title,
    userGoalId,
    manualGoalData
  );

  // 게시글 생성
  const newPost = await Post.create({
    author: userId,
    title,
    content,
    boardType,
    linkedGoal: linkedGoalId,
  });

  return newPost;
};

// 게시글 수정
const updatePost = async (postId, userId, data) => {
  const { title, content, images, boardType, userGoalId, manualGoalData } =
    data;

  // 기존 게시글 조회 및 권한 확인
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new BadRequestError("수정 권한이 없습니다.");
  }

  // 필수 데이터 업데이트
  if (title) post.title = title;
  if (content) post.content = content;
  if (images) post.images = images;
  if (boardType) post.boardType = boardType;

  // 목표 변경 사항 처리
  if (userGoalId !== undefined || manualGoalData !== undefined) {
    post.linkedGoal = await processLinkedGoal(
      userId,
      post.title,
      userGoalId,
      manualGoalData
    );
  }

  await post.save();

  return {
    postId: post._id,
    message: "게시글이 수정되었습니다.",
  };
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

  const isLiked = userId
    ? post.likes.some((id) => id.toString() === userId.toString())
    : false;

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

  const customExercises = goal.exercises.map((ex) => ({
    exerciseId: ex.exerciseId,
    days: ex.days,
    restTime: ex.restTime,
    sets: ex.sets.map((s) => ({
      setNumber: s.setNumber,
      weight: s.weight,
      reps: s.reps,
    })),
  }));

  // 3. 활동 요일(activeDays) 계산
  const activeDays = [...new Set(goal.exercises.flatMap((ex) => ex.days || []))].sort();

  // UserGoal 생성
  const userGoal = await UserGoal.create({
    userId,
    goalId: goal._id,
    durationWeek: goal.durationWeek,
    status: "진행중",
    startDate: new Date(),
    currentWeek: 1,
    completedSessions: 0,
    activeDays: activeDays,      
    customExercises: customExercises, 
    isModified: false,
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
