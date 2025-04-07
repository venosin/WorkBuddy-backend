/*
Modelo para gestionar productos favoritos de los usuarios
Campos:
- userId: ID del usuario (cliente o empleado)
- userType: Tipo de usuario (cliente o empleado)
- products: Array de IDs de productos favoritos
*/

import { Schema, model } from "mongoose";

const favoriteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      // Puede ser cliente o empleado
    },
    userType: {
      type: String,
      required: true,
      enum: ["clients", "employees", "admin"],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Índice compuesto para asegurar que cada usuario tenga solo un documento de favoritos
favoriteSchema.index({ userId: 1, userType: 1 }, { unique: true });

export default model("favorites", favoriteSchema);
