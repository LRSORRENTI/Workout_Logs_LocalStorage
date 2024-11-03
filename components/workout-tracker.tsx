// components/workout-tracker.tsx

"use client";

import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { WorkoutForm } from "./workout-form";
import { WorkoutDisplay } from "./workout-display";
import type { Workout } from "@/services/workoutService";
import { getWorkoutService } from "@/services/workoutServiceFactory";

export default function WorkoutTracker() {
  const [date, setDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const workoutService = getWorkoutService();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const allWorkouts = await workoutService.getWorkouts();
        // Filter workouts by selected date
        const filteredWorkouts = allWorkouts.filter(
          (workout) => workout.date === format(date, "yyyy-MM-dd")
        );
        setWorkouts(filteredWorkouts);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setWorkouts([]);
      }
    };

    fetchWorkouts();
  }, [date]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold mx-auto">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border shadow mx-auto"
            />
            <WorkoutDisplay
              workouts={workouts}
              selectedDate={date}
              setWorkouts={setWorkouts}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold mx-auto">Log Workout</h2>
            <WorkoutForm
              selectedDate={date}
              onWorkoutAdded={(newWorkout) =>
                setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout])
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
