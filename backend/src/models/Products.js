/*
Campos:
    name
    description
    category
    price
    stock
    imagery: {
      url          - URL de la imagen en Cloudinary
      public_id    - ID público de la imagen en Cloudinary
      filename     - Nombre original del archivo
    }
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
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        required: false,
      }
    },
  },
  {
    timestamps: true,
    // versionKey: false,
    strict: false,
  }
);

export default model("products", productSchema);
