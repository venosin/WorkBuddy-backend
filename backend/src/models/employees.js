import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
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
      minlength: [8, "Deben ser 8 caracteres"],
    },
    hiringDate: {
      type: Date,
      require: true,
    },
    dui: {
      type: String,
      require: true,
      maxLength: 10,
    },
    Isss: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("employees", employeeSchema);
