// routes/routines.js
const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const { 
    createRoutine, 
    getRoutines, 
    getRoutineDetail, 
    updateRoutine, 
    deleteRoutine 
} = require('../controllers/routinesController');


// 루틴/챌린지 생성 (POST /api/v1/routines)
router.post("/", protect, createRoutine);

// 루틴/챌린지 목록 조회 (GET /api/v1/routines)
router.get("/", protect, getRoutines);

// 특정 루틴/챌린지 상세 조회 (GET /api/v1/routines/:routineId)
router.get("/:routineId", protect, getRoutineDetail); 

// 특정 루틴/챌린지 수정 (PUT /api/v1/routines/:routineId)
router.put("/:routineId", protect, updateRoutine);

// 특정 루틴/챌린지 삭제 (DELETE /api/v1/routines/:routineId)
router.delete("/:routineId", protect, deleteRoutine);

module.exports = router;