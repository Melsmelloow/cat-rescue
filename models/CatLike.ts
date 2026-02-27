import mongoose, { Schema, model, models } from "mongoose";

export interface ICatLike {
  catId: mongoose.Types.ObjectId;
  deviceId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CatLikeSchema = new Schema<ICatLike>(
  {
    catId: {
      type: Schema.Types.ObjectId,
      ref: "Cat",
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Compound Unique Index
 * Prevents:
 * Same device liking same cat twice
 */
CatLikeSchema.index({ catId: 1, deviceId: 1 }, { unique: true });

export const CatLike =
  models.CatLike || model<ICatLike>("CatLike", CatLikeSchema);
