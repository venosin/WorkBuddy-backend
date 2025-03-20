/*
Campos:
    clientId
    productId
    score
    comment
*/

import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "clients",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    // versionKey: false,
    strict: false,
  }
);

export default model("reviews", reviewSchema);



