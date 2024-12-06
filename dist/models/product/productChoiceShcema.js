"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productChoiceSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productImageSchema_1 = require("./productImageSchema");
exports.productChoiceSchema = new mongoose_1.default.Schema({
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
    images: [productImageSchema_1.productImageSchema],
});
