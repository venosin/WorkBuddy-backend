/*
Campos:
clienteId
products
discountCodesId
total
state
*/

import { Schema, model } from "mongoose";

const shoppingCartsSchema = new Schema(
  {
    clienteId: {
      type: Schema.Types.ObjectId,
      ref: "clients", // Referencia a la colección de clientes
      required: [true, "El ID del cliente es obligatorio"],
    },
    products: [
      {
        idProduct: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: [true, "El ID del producto es obligatorio"],
        },
        quantity: {
          type: Number,
          required: [true, "La cantidad es obligatoria"],
        },
      },
    ],
    discountCodesId: {
      type: Schema.Types.ObjectId,
      ref: "discountCodes",
    },
    total: {
      type: Number,
      required: true,
    },
    state: {
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

export default model("shoppingCarts", shoppingCartsSchema);
