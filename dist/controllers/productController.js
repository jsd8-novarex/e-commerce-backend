"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = exports.getProductById = exports.getProduct = void 0;
const productModel_1 = __importDefault(require("../models/product/productModel"));
// GET: Fetch all product
const getProduct = async (req, res, next) => {
    try {
        const products = await productModel_1.default.find();
        res.status(200).json({
            status: 'success',
            products,
        });
    }
    catch (error) {
        res.status(400).send({ status: 'failure', message: error.message });
    }
};
exports.getProduct = getProduct;
// GET: Fetch  product by ID
const getProductById = async (req, res, next) => {
    try {
        const { productId, choiceId } = req.body;
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({
                status: 'failure',
                message: 'Product not found',
            });
            return;
        }
        // ถ้ามี choiceId ค้นหาตัวเลือกของสินค้า
        if (choiceId) {
            const productChoice = product.product_choices?.find((choice) => String(choice.id) === String(choiceId));
            if (!productChoice) {
                res.status(404).json({
                    status: 'failure',
                    message: 'Product choice not found',
                });
                return;
            }
            res.status(200).json({
                message: 'Product choice fetched successfully',
                data: productChoice,
            });
            return;
        }
        // ถ้าไม่มี choiceId ให้ส่งข้อมูลสินค้าทั้งหมด
        res.status(200).json({
            message: 'Product fetched successfully',
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({ status: 'failure', message: error.message });
    }
};
exports.getProductById = getProductById;
const addProduct = async (req, res) => {
    try {
        const { name, brand, category, gender, description, product_choices, creator_id, last_op_id, } = req.body;
        if (!name ||
            !brand ||
            !category ||
            !gender ||
            !description ||
            !creator_id ||
            !last_op_id) {
            res.status(400).send({
                status: 'failure',
                message: 'Missing required fields',
            });
            return;
        }
        const create_timestamp = new Date();
        const last_updated_timestamp = new Date();
        const newProduct = new productModel_1.default({
            name,
            brand,
            category,
            gender,
            description,
            product_choices,
            create_timestamp,
            last_updated_timestamp,
            creator_id,
            last_op_id,
            tram_status: true,
        });
        await newProduct.save();
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: newProduct,
        });
    }
    catch (error) {
        console.error('Error adding product:', error);
    }
};
exports.addProduct = addProduct;
