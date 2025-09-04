import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuid } from "uuid";

export interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  weightUnit: "kg" | "lbs";
  isCompleted: boolean;
}

//  Store Interface
interface WorkoutExercise {
  id: string;
  sanityId: string; //Store Sanity _id
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutStore {
  // State variables
  workoutExercises: WorkoutExercise[];
  weightUnit: "kg" | "lbs";

  // Actions here that can be performed across the state
  addExerciseToWorkout: (exercise: { name: string; sanityId: string }) => void;
  setWorkoutExercises: (
    exercises:
      | WorkoutExercise[]
      | ((prev: WorkoutExercise[]) => WorkoutExercise[]),
  ) => void;
  setWeightUnit: (unit: "kg" | "lbs") => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutExercises: [],
      weightUnit: "kg",

      addExerciseToWorkout: (exercise) =>
        set((state) => {
          const newExercise: WorkoutExercise = {
            id: uuid(),
            sanityId: exercise.sanityId,
            name: exercise.name,
            sets: [],
          };
          return {
            workoutExercises: [...state.workoutExercises, newExercise],
          };
        }),

      setWorkoutExercises: (exercises) =>
        set((state) => ({
          workoutExercises:
            typeof exercises === "function"
              ? exercises(state.workoutExercises)
              : exercises,
        })),

      setWeightUnit: (unit) =>
        set({
          weightUnit: unit,
        }),

      resetWorkout: () =>
        set({
          workoutExercises: [],
        }),
    }),
    {
      name: "workout-store",
      storage: createJSONStorage(() => AsyncStorage),

      // select partial state to persist here:
      partialize: (state) => ({
        weightUnit: state.weightUnit,
      }),
    },
  ),
);
