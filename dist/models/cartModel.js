"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = __importDefault(require("./product/productModel"));
const cartItemSchema = new mongoose_1.default.Schema({
    id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: () => new mongoose_1.default.Types.ObjectId(),
    },
    product_choice_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
}, {
    _id: false,
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
    total_price: { type: Number, required: true, default: 0 },
    create_timestamp: { type: Date, default: Date.now },
    last_updated_timestamp: { type: Date, default: Date.now },
    creator_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    last_op_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    tram_status: { type: Boolean, default: true },
});
cartSchema.pre('save', async function (next) {
    if (this.isModified('cart_item')) {
        try {
            const productChoiceIds = this.cart_item.map(item => item.product_choice_id);
            const cartProductItems = await productModel_1.default.aggregate([
                { $unwind: '$product_choices' },
                { $match: { 'product_choices._id': { $in: productChoiceIds } } },
                {
                    $addFields: {
                        product_choice_id: '$product_choices._id',
                        price: '$product_choices.price',
                    },
                },
                {
                    $project: {
                        _id: 0,
                        product_choice_id: 1,
                        price: 1,
                    },
                },
            ]);
            const productPriceMap = cartProductItems.reduce((acc, product) => {
                acc[product.product_choice_id.toString()] = product.price;
                return acc;
            }, {});
            this.total_price = this.cart_item.reduce((total, item) => {
                const price = productPriceMap[item.product_choice_id.toString()] || 0;
                return total + price * item.quantity;
            }, 0);
        }
        catch (error) {
            console.error('Error calculating total_price:', error);
            return next(error);
        }
    }
    next();
});
const cartModel = mongoose_1.default.model('cart', cartSchema, 'cart');
exports.default = cartModel;
