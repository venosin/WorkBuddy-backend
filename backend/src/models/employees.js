import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      maxLength: 9,
    },
    email: {
      type: String,
      required: true,
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
      minlength: [8, "Deben ser 8 caracteres"],
    },
    hiringDate: {
      type: Date,
      required: true,
    },
    dui: {
      type: String,
      required: true,
      maxLength: 10,
    },
    Isss: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("employees", employeeSchema);
