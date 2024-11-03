// components/workout-form.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "../hooks/use-toast";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { WorkoutTypeSelect } from "./workout-type-select";
import type { Workout } from "@/services/workoutService"; // Adjusted import path
import { getWorkoutService } from "@/services/workoutServiceFactory";

interface WorkoutFormProps {
  selectedDate: Date;
  onWorkoutAdded: (newWorkout: Workout) => void;
}

export function WorkoutForm({
  selectedDate,
  onWorkoutAdded,
}: WorkoutFormProps) {
  const [workoutType, setWorkoutType] = useState<string>("");
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [setNumber, setSetNumber] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const { toast } = useToast(); // Destructure toast from useToast
  const workoutService = getWorkoutService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!selectedDate || !workoutType || !exerciseName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive", // Use 'destructive' variant for errors
      });
      return;
    }

    if (workoutType === "Cardio") {
      if (!duration) {
        toast({
          title: "Error",
          description: "Please enter the duration for cardio workouts",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (weight === "" || setNumber === "" || reps === "") {
        toast({
          title: "Error",
          description: "Please fill in weight, set number, and reps",
          variant: "destructive",
        });
        return;
      }
    }

    const formData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      workoutType,
      exerciseName,
      weight: weight === "" ? undefined : parseInt(weight),
      setNumber: setNumber === "" ? undefined : parseInt(setNumber),
      reps: reps === "" ? undefined : parseInt(reps),
      duration: duration === "" ? undefined : parseInt(duration),
    };

    try {
      // Use the workoutService to add the workout
      const newWorkout = await workoutService.addWorkout(formData);

      toast({
        title: "Success",
        description: "Workout saved successfully!",
        variant: "success",
      });

      // Reset form fields
      setWorkoutType("");
      setExerciseName("");
      setWeight("");
      setSetNumber("");
      setReps("");
      setDuration("");

      // Update parent component with the new workout
      onWorkoutAdded(newWorkout);
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="workout-type">Workout Type</Label>
        <WorkoutTypeSelect value={workoutType} onValueChange={setWorkoutType} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercise">Exercise Name</Label>
        <Input
          id="exercise"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="e.g., Barbell Curl"
        />
      </div>

      {workoutType === "Cardio" ? (
        // Render Duration Input for Cardio
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            placeholder="e.g., 30"
          />
        </div>
      ) : (
        // Render Weight, Sets, and Reps Inputs for Other Workouts
        <>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              placeholder="e.g., 70"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setNumber">Set #</Label>
              <Input
                id="setNumber"
                type="number"
                value={setNumber}
                onChange={(e) => setSetNumber(e.target.value)}
                min="1"
                placeholder="e.g., 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min="1"
                placeholder="e.g., 12"
              />
            </div>
          </div>
        </>
      )}

      <Button type="submit" className="w-full">
        <Dumbbell className="mr-2 h-4 w-4" />
        Save Workout
      </Button>
    </form>
  );
}
