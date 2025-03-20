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
            ref: "clients",
            required: true,
        },
        products: {
            type: Array,
            required: true,
        },
        discountCodesId: {
            type: Schema.Types.ObjectId,
            ref: "DiscountCodes",
        },
        total: {
            type: Number,
            required: true,
        },
        state: {
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

export default model("shoppingCarts", shoppingCartsSchema);    