/*
Modelo de Orders mejorado:
Campos: 
- CartId: Referencia al carrito de compras
- paymentInfo: Información del pago (método, estado, transacción)
- shippingAddress: Dirección de envío
- status: Estado de la orden (pendiente, pagada, enviada, entregada, cancelada)
- totalAmount: Monto total de la orden
*/

import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        CartId: {
            type: Schema.Types.ObjectId,
            ref: "shoppingCarts",
            required: true,
        },
        paymentInfo: {
            method: {
                type: String,
                enum: ["paypal", "credit_card", "efectivo"],
                required: true,
            },
            status: {
                type: String,
                enum: ["pending", "completed", "failed", "refunded"],
                default: "pending"
            },
            transactionId: {
                type: String,
                default: null
            },
            paymentDate: {
                type: Date,
                default: null
            }
        },
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true }
        },
        status: {
            type: String,
            enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        totalAmount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
        strict: false
    }
);

export default model("orders", orderSchema)
