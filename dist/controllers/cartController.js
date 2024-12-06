"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCurrentCart = exports.getCartByCustomerId = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const getCartByCustomerId = async (req, res) => {
    try {
        const { id } = req.body;
        const isCart = await cartModel_1.default.find({ customer_id: id });
        res.status(200).json({ success: true, cart: isCart });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCartByCustomerId = getCartByCustomerId;
const postCurrentCart = async (req, res) => {
    try {
        const { id, existingCart } = req.body;
        if (existingCart) {
            res.status(200).json({ success: true, cart: existingCart });
            return;
        }
        const newCart = await cartModel_1.default.create({
            customer_id: id,
            status: 'pending',
            payment_method: 'none',
            payment_status: 'not_paid',
            cart_item: [],
            creator_id: id,
            last_op_id: id,
        });
        res.status(201).json({ success: true, cart: newCart });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.postCurrentCart = postCurrentCart;
