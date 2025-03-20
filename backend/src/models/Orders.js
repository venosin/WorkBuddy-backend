/*
Campos: 
CartId
payMethod
shippingAdress
*/

import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        CartId: {
            type: String,
            required: true,
        },
        payMethod: {
            type: String,
            required: true,
        },
        shippingAdress: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        // versionKey: false,
        strict: false
    }
);

export default model("Order", orderSchema)
