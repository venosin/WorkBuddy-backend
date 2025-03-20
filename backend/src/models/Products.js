/*
Campos:
    name
    description
    category
    price
    stock
    imagery
*/

import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    imagery: {
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

export default model("products", productSchema);
