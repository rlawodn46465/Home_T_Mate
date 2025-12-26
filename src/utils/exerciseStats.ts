// src/utils/exerciseStats.js

interface RawSet {
  setNumber?: number;
  weight?: number;
  reps?: number;
}

interface RawExercise {
  _id?: string | number;
  exerciseId?: string | number;
  name: string;
  sets?: RawSet[];
  duration?: number;
}

export interface CalculatedExercise {
  exerciseId: string | number;
  name: string;
  sets: {
    setNumber: number;
    weight: number;
    reps: number;
    isCompleted: boolean;
  }[];
  maxWeight: number;
  totalVolume: number;
  totalReps: number;
  duration: number;
}

export const calculateExerciseStats = (
  exercises: RawExercise[]
): CalculatedExercise[] => {
  return exercises.map((ex) => {
    let maxWeight = 0;
    let totalVolume = 0;
    let totalReps = 0;

    const setsArray = ex.sets && Array.isArray(ex.sets) ? ex.sets : [];

    const setsWithCompletion = setsArray.map((set, index) => {
      const weight = set.weight || 0;
      const reps = set.reps || 0;
      const volume = weight * reps;
      totalVolume += volume;
      totalReps += reps;
      if (weight > maxWeight) maxWeight = weight;

      return {
        setNumber: set.setNumber || index + 1,
        weight: weight,
        reps: reps,
        isCompleted: true,
      };
    });

    return {
      exerciseId: ex._id || ex.exerciseId,
      name: ex.name,
      sets: setsWithCompletion,
      maxWeight: maxWeight,
      totalVolume: totalVolume,
      totalReps: totalReps,
      duration: (ex.duration || 0) * 60,
    };
  });
};
