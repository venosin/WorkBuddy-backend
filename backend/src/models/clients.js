import { Schema, model } from "mongoose";

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,  // Cambiado de "require" a "required"
      maxLength: 25,
    },
    phoneNumber: {
      type: String,
      required: true,  // Cambiado de "require" a "required"
      maxLength: 9,
    },
    email: {
      type: String,
      required: true,  // Cambiado de "require" a "required"
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Por favor, ingrese un correo electrónico válido",
      ],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,  // Este ya está correcto
      minlength: 8,
    },
    address: {
      type: String,
      required: true,  // Cambiado de "require" a "required"
    },
    birthday: {
      type: Date,
      required: true,  // Cambiado de "require" a "required"
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: true }
);

export default model("clients", clientSchema);