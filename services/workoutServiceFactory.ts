// /services/workoutServiceFactory.ts

import { localStorageWorkoutService } from './workoutService.localStorage';
import { WorkoutService } from './workoutService';

export function getWorkoutService(): WorkoutService {
  return localStorageWorkoutService;
}
