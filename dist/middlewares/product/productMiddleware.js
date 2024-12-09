"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProductChoiceIdMiddleware = exports.validateProductIdMiddleware = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = __importDefault(require("../../models/product/productModel"));
const validateProductIdMiddleware = async (req, res, next) => {
    try {
        const { productId } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            res.status(400).json({ success: false, message: 'Invalid product ID' });
            return;
        }
        const isProduct = await productModel_1.default.findById(productId);
        if (!isProduct) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateProductIdMiddleware = validateProductIdMiddleware;
const validateProductChoiceIdMiddleware = async (req, res, next) => {
    try {
        const { productChoiceId } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(productChoiceId)) {
            res
                .status(400)
                .json({ success: false, message: 'Invalid productChoice ID' });
            return;
        }
        const isProduct = await productModel_1.default.findOne({
            'product_choices._id': productChoiceId,
        });
        if (!isProduct) {
            res.status(404).json({ success: false, message: 'Product Choice not found' });
            return;
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateProductChoiceIdMiddleware = validateProductChoiceIdMiddleware;
