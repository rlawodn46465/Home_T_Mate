import { useState } from "react";
import RoutineExerciseItem from "./RoutineExerciseItem";
import "./RoutineExerciseList.css";

const RoutineExerciseList = ({ exercises, onOpenModal, onRemoveExercise }) => {

  return (
    <div className="routine-exercise-list">
      {exercises.map((exercise, index) => (
        <RoutineExerciseItem
          key={exercise.id}
          exercise={exercise}
          onRemove={onRemoveExercise}
        />
      ))}
      <div className="add-exercise-area">
        <button className="add-exercise-button" onClick={onOpenModal}>
          + 운동 추가
        </button>
      </div>
      {/* {isModalOpen && <ExerciseSelectModal onClose={() => setIsModalOpen(false)} onSelect={handleSelectExercise} />} */}
    </div>
  );
};

export default RoutineExerciseList;
