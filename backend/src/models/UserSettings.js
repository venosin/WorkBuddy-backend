/*
Modelo para gestionar la configuración/preferencias de los usuarios
Campos:
- userId: ID del usuario (cliente o empleado)
- userType: Tipo de usuario (cliente o empleado)
- addresses: Direcciones guardadas del usuario
- preferences: Preferencias generales (notificaciones, privacidad, etc.)
*/

import { Schema, model } from "mongoose";

// Esquema para direcciones
const addressSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// Esquema principal de configuración
const userSettingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["clients", "employees", "admin"],
    },
    addresses: [addressSchema],
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        promotions: {
          type: Boolean,
          default: true,
        },
        orderUpdates: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        shareProfileData: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Índice compuesto para asegurar que cada usuario tenga solo un documento de configuración
userSettingsSchema.index({ userId: 1, userType: 1 }, { unique: true });

export default model("userSettings", userSettingsSchema);
