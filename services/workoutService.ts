// /services/workoutService.ts

export interface Workout {
    id: number;
    date: string;
    workoutType: string;
    exerciseName: string;
    weight?: number;
    setNumber?: number;
    reps?: number;
    duration?: number;
    createdAt?: string;
  }
  
  export interface WorkoutService {
    getWorkouts(): Promise<Workout[]>;
    addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout>;
    deleteWorkout(id: number): Promise<void>;
  }
  