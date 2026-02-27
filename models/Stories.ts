import mongoose, { model, models, Types } from "mongoose";

export interface IStory {
  _id?: Types.ObjectId;
  cats: Types.ObjectId[]; // references Cat
  caption: string;
  tags: string[];
  coverImage: string;
  slug: string;
  likes: number;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const StorySchema = new mongoose.Schema(
  {
    cats: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Cat", required: true },
    ],

    caption: { type: String, required: true },

    tags: [{ type: String }],

    coverImage: { type: String, required: true },

    slug: { type: String, unique: true, required: true },

    likes: { type: Number, default: 0 },

    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Stories = models.Stories || model<IStory>("Stories", StorySchema);
