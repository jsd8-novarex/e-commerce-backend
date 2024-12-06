"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productImageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.productImageSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
}, { _id: false });
