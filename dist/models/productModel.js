"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productChoiceSchema = new mongoose_1.default.Schema({
    id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: new mongoose_1.default.Types.ObjectId(),
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            index: {
                type: Number,
                required: true,
            },
        },
    ],
});
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    product_choices: [productChoiceSchema],
    create_timestamp: {
        type: Date,
        default: Date.now,
    },
    last_updated_timestamp: {
        type: Date,
        default: Date.now,
    },
    creator_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    last_op_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    tram_status: {
        type: Boolean,
        default: true,
    },
});
const productModel = mongoose_1.default.model('product', productSchema, 'product');
exports.default = productModel;
