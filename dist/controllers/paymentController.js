"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStripe = exports.placeOrderStripe = void 0;
// Required imports
const stripe_1 = __importDefault(require("stripe"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const customerAddress_1 = __importDefault(require("../models/customerAddress"));
const productModel_1 = __importDefault(require("../models/product/productModel"));
dotenv_1.default.config();
// Initialize Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const currency = 'thb';
const deliveryCharge = 0;
// Place order using Stripe
const placeOrderStripe = async (req, res, next) => {
    try {
        const { customerId } = req.body;
        // Fetch customer address
        const customerAddress = await customerAddress_1.default.findOne({
            customer_id: new mongoose_1.default.Types.ObjectId(customerId),
        });
        if (!customerAddress) {
            res
                .status(404)
                .json({ success: false, message: 'Customer address not found' });
            return;
        }
        const address = {
            street: customerAddress.address,
            subdistrict: customerAddress.subdistrict,
            district: customerAddress.district,
            province: customerAddress.province,
            postalCode: customerAddress.postal_code,
        };
        // Fetch cart and validate, excluding "completed" or "cancelled" carts
        const cart = await cartModel_1.default.findOne({
            customer_id: new mongoose_1.default.Types.ObjectId(customerId),
            status: { $nin: ['completed', 'cancelled'] },
        });
        if (!cart || cart.cart_item.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Cart is empty, completed, cancelled, or not found',
            });
            return;
        }
        // Fetch product details for the cart items
        const productChoiceIds = cart.cart_item.map((item) => item.product_choice_id);
        const products = await productModel_1.default.aggregate([
            { $unwind: '$product_choices' },
            { $match: { 'product_choices._id': { $in: productChoiceIds } } },
            {
                $addFields: {
                    product_choice_id: '$product_choices._id',
                    name: '$name',
                },
            },
            {
                $project: {
                    product_choice_id: 1,
                    name: 1,
                    price: '$product_choices.price',
                },
            },
        ]);
        const productMap = products.reduce((acc, product) => {
            acc[product.product_choice_id.toString()] = product;
            return acc;
        }, {});
        // Create line items for Stripe
        const line_items = cart.cart_item.map((item) => {
            const product = productMap[item.product_choice_id.toString()];
            if (!product) {
                throw new Error(`Product with ID ${item.product_choice_id} not found.`);
            }
            return {
                price_data: {
                    currency,
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: item.quantity,
            };
        });
        // Add delivery charge
        line_items.push({
            price_data: {
                currency,
                product_data: { name: 'Delivery Charge' },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });
        // Create order
        const orderData = {
            userId: new mongoose_1.default.Types.ObjectId(customerId),
            items: cart.cart_item,
            amount: cart.total_price + deliveryCharge,
            address,
            paymentMethod: 'Stripe',
            payment: false,
            status: 'Order Placed',
            date: Date.now(),
        };
        const newOrder = new orderModel_1.default(orderData);
        await newOrder.save();
        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            success_url: `${req.headers.origin || process.env.VERCEL_ONE_URL}/verify?success=true&orderId=${newOrder._id}` ||
                `${req.headers.origin || 'http://localhost:4000'}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${req.headers.origin || process.env.VERCEL_ONE_URL}/verify?success=false&orderId=${newOrder._id}` ||
                `${req.headers.origin || 'http://localhost:4000'}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });
        res.status(200).json({ success: true, sessionUrl: session.url });
    }
    catch (error) {
        console.error('Error placing order:', error);
        next(error);
    }
};
exports.placeOrderStripe = placeOrderStripe;
// Verify Stripe payment
const verifyStripe = async (req, res, next) => {
    try {
        const { orderId, success } = req.body; // เพิ่ม `customerId` มาด้วยสำหรับลบตะกร้า
        // ตรวจสอบว่าการชำระเงินสำเร็จหรือไม่
        if (success === 'true') {
            // อัปเดตสถานะการชำระเงินในคำสั่งซื้อ
            const updatedOrder = await orderModel_1.default.findByIdAndUpdate(orderId, { payment: true }, { new: true } // Return the updated document
            );
            if (!updatedOrder) {
                res
                    .status(404)
                    .json({ success: false, message: 'Order not found for update' });
                return;
            }
            //   // ลบตะกร้าสินค้าหลังการชำระเงินสำเร็จ
            //   await cartModel.findOneAndDelete({ customer_id: customerId });
            //   res.status(200).json({
            //     success: true,
            //     message: 'Payment verified and order updated',
            //     order: updatedOrder,
            //   });
            // } else {
            //   // หากการชำระเงินล้มเหลว ให้ลบคำสั่งซื้อ
            //   await orderModel.findByIdAndDelete(orderId);
            res.status(400).json({
                success: false,
                message: 'Payment failed. Order cancelled.',
            });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        next(error);
    }
};
exports.verifyStripe = verifyStripe;
