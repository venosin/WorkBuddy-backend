import { Schema, model } from "mongoose";

const offersSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ['percentage', 'fixed_value'],
    },
    percentage: {
      type: Number,
      // Consider adding a custom validator if discountType is 'percentage'
      // min: 0, max: 100 // if it's a percentage
    },
    value: {
      type: Number,
      // Consider adding a custom validator if discountType is 'fixed_value'
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
      // Consider adding a custom validator to ensure 'to' is after 'from'
    },
    state: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'scheduled', 'expired'],
      default: 'scheduled', // Or 'active' depending 
    },
  },
  {
    timestamps: true,
  }
);
export default model("offers", offersSchema);