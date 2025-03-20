import { Schema, model } from "mongoose";

const clientSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      maxLength: 25,
    },
    phoneNumber: {
      type: String,
      require: true,
      maxLength: 9,
    },
    email: {
      type: String,
      require: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Por favor, ingrese un correo electrónico válido",
      ],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    address: {
      type: String,
      require: true,
    },
    birthday: {
      type: Date,
      require: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: true }
);

export default model("clients", clientSchema)