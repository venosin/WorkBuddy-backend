import { Schema, model } from "mongoose";

const codesSchema = new Schema({
  clientsId: [
    {
      clientId: {
        type: Schema.Types.ObjectId,
        ref: "clients",
        unique: true
      },
    },
  ],
  code: {
    type: String,
    require: true
  }, 
  percentage: {
    type: Number
  },
  isActive: {
    type: Boolean,
    require: true
  }
});

export default model("discountCodes", codesSchema)