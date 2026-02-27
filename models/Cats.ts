import mongoose, { Schema, model, models } from "mongoose";

export interface ICat {
  name: string;
  breed: string;
  story: string;
  images: string[];
  likes: number;
  medicalStatus: string;
  personality: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CatSchema = new Schema<ICat>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    breed: {
      type: String,
      required: true,
      trim: true,
    },

    story: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    likes: {
      type: Number,
      default: 0,
    },

    medicalStatus: {
      type: String,
      required: true,
    },

    personality: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  },
);

export const Cat = models.Cat || model<ICat>("Cat", CatSchema);
