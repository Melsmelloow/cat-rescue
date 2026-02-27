import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload (Next.js dev mode)
export const User =
  models.User || model<IUser>("User", UserSchema);