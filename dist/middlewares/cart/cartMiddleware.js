"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCartByCustomerIdMiddleware = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartModel_1 = __importDefault(require("../../models/cartModel"));
const validateCartByCustomerIdMiddleware = async (req, res, next) => {
    try {
        const { customerId } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
            res.status(400).json({ success: false, message: 'Invalid customer ID' });
            return;
        }
        const existingCart = await cartModel_1.default.findOne({
            customer_id: customerId,
            status: { $nin: ['completed', 'cancelled'] },
        });
        if (existingCart) {
            req.body.existingCart = existingCart;
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateCartByCustomerIdMiddleware = validateCartByCustomerIdMiddleware;
