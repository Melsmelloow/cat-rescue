import mongoose, { Schema, model, models } from "mongoose";

interface IStoryLike {
  story: mongoose.Types.ObjectId;
  deviceId: string;
  createdAt?: Date;
}

const StoryLikeSchema = new Schema<IStoryLike>(
  {
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stories",
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate likes per device per story
StoryLikeSchema.index({ story: 1, deviceId: 1 }, { unique: true });

export const StoryLike =
  models.StoryLike || model<IStoryLike>("StoryLike", StoryLikeSchema);
