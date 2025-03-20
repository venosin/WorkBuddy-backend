import { Schema, model } from "mongoose";

const offerShema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      require: true,
    },
    discountType: {
      type: String,
      require: true,
    },
    percentage: {
      type: Number,
    },
    value: {
      type: Number,
    },
    from: {
      type: Date,
      require: true,
    },
    to: {
      type: Date,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
