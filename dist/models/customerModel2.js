"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile_phone: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    create_timestamp: { type: Date, default: Date.now },
    last_updated_timestamp: { type: Date, default: Date.now },
    creator_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    last_op_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    tram_status: { type: Boolean, default: true },
});
const customer = mongoose_1.default.model('customer', customerSchema, 'customer');
exports.default = customer;
