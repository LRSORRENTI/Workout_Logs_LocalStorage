"use client";

import { format, startOfToday } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { WorkoutForm } from "./workout-form";
import { WorkoutDisplay } from "./workout-display";
import type { Workout } from "@/services/workoutService";
import { getWorkoutService } from "@/services/workoutServiceFactory";

export default function WorkoutTracker() {
  // Initialize with startOfToday to ensure consistent date handling
  const [date, setDate] = useState<Date>(() => {
    const today = startOfToday();
    // Ensure the date is created with the local timezone
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12, // set to noon to avoid timezone issues
      0,
      0,
      0
    );
  });
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const workoutService = getWorkoutService();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const allWorkouts = await workoutService.getWorkouts();
        // Use the normalized date format for comparison
        const dateStr = format(date, "yyyy-MM-dd");
        const filteredWorkouts = allWorkouts.filter(
          (workout) => workout.date === dateStr
        );
        setWorkouts(filteredWorkouts);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setWorkouts([]);
      }
    };

    fetchWorkouts();
  }, [date]);

  // Create a handler for date selection to ensure consistent date handling
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Normalize the selected date
      const normalizedDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        12, // set to noon to avoid timezone issues
        0,
        0,
        0
      );
      setDate(normalizedDate);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold mx-auto">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
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