"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/orderModel.js
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'Order Placed', required: true },
    paymentMethod: { type: String, default: 'Stripe', required: true },
    payment: { type: Boolean, default: false, required: true },
    date: { type: Date, default: Date.now, required: true },
});
const orderModel = mongoose_1.default.model('Order', orderSchema, 'order');
exports.default = orderModel;
