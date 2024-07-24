import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
   name: {
      required: true,
      type: String,
   },
   password: {
      required: true,
      type: String,
   },
   email: {
      required: true,
      type: String,
   },
   age: {
      type: Number,
   },
   gender: {
      type: String,
   },
   height: {
      type: Number,
   },
   weight: {
      type: Number,
   },
   profilePicture: {
      type: String,
   },
   activityLevel: {
      type: String,
   },
   goals: {
      type: String,
   },
   workoutPreferences: {
      type: [String],
   },
   bmi: {
      type: Number,
   },
   bodyFatPercentage: {
      type: Number,
   },
   caloricIntake: {
      type: Number,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   lastLogin: {
      type: Date,
   },
   workoutHistory: {
      type: [
         {
            date: Date,
            workoutType: String,
            duration: Number,
            caloriesBurned: Number,
         },
      ],
   },
   role: {
      type: String,
      default: "user",
   },
   settings: {
      notifications: {
         type: Boolean,
         default: true,
      },
      theme: {
         type: String,
         default: "light",
      },
   },
});

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
