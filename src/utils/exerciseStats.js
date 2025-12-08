// src/utils/exerciseStats.js

export const calculateExerciseStats = (exercises) => {
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
      exerciseId: ex._id || ex.exerciseId, // ID는 _id 또는 exerciseId 사용
      name: ex.name,
      sets: setsWithCompletion,
      maxWeight: maxWeight,
      totalVolume: totalVolume,
      totalReps: totalReps,
      duration: (ex.duration || 0) * 60,
    };
  });
};
