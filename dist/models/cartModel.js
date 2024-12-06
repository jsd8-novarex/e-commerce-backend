"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartItemSchema = new mongoose_1.default.Schema({
    id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: new mongoose_1.default.Types.ObjectId(),
    },
    product_choice_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    creator_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    last_op_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
});
const cartSchema = new mongoose_1.default.Schema({
    customer_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: [
            'pending',
            'active',
            'ready',
            'processing',
            'completed',
            'cancelled',
        ],
    },
    payment_method: {
        type: String,
        default: 'none',
        enum: ['credit_card', 'none'],
    },
    payment_status: {
        type: String,
        required: true,
        default: 'not_paid',
        enum: ['not_paid', 'in_progress', 'paid', 'failed'],
    },
    payment_timestamp: { type: Date, default: null },
    cart_item: [cartItemSchema],
    create_timestamp: { type: Date, default: Date.now },
    last_updated_timestamp: { type: Date, default: Date.now },
    creator_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    last_op_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    tram_status: { type: Boolean, default: true },
});
const customer = mongoose_1.default.model('cart', cartSchema, 'cart');
exports.default = customer;
