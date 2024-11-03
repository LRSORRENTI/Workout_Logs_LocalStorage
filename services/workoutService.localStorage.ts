// /services/workoutService.localStorage.ts

import { Workout, WorkoutService } from './workoutService';

export const localStorageWorkoutService: WorkoutService = {
  async getWorkouts() {
    const workoutsJson = localStorage.getItem('workouts');
    return workoutsJson ? (JSON.parse(workoutsJson) as Workout[]) : [];
  },

  async addWorkout(workoutData) {
    const workouts = await this.getWorkouts();
    const id = Date.now(); // Simple ID generation using timestamp
    const newWorkout: Workout = {
      ...workoutData,
      id,
      createdAt: new Date().toISOString(),
    };
    workouts.push(newWorkout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    return newWorkout;
  },

  async deleteWorkout(id) {
    let workouts = await this.getWorkouts();
    workouts = workouts.filter((workout) => workout.id !== id);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  },
};
