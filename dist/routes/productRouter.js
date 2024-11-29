"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = getProduct;
exports.getProductById = getProductById;
exports.getProductChoiceById = getProductChoiceById;
const express_1 = __importDefault(require("express"));
const PRODUCT_DATA_1 = require("../constraints/PRODUCT_DATA");
const productRouter = express_1.default.Router();
const products = PRODUCT_DATA_1.product_list;
productRouter.get('/', getProduct);
productRouter.get('/:productId', getProductById);
productRouter.get('/:productId/choice', getProductChoiceById);
async function getProduct(req, res, next) {
    try {
        res.status(200).send({
            message: 'test getProduct',
        });
    }
    catch (error) {
        res.status(400).send({ status: 'failure', message: error.message });
    }
}
async function getProductById(req, res, next) {
    try {
        const { productId } = req.params;
        const product = products.find(product => String(product.id) === productId);
        res.status(200).send({
            message: 'test getProductฺById',
            data: product
        });
    }
    catch (error) {
        res.status(400).send({ status: 'failure', message: error.message });
    }
}
async function getProductChoiceById(req, res, next) {
    try {
        const { productId } = req.params;
        const product = products.find(product => String(product.id) === productId);
        res.status(200).send({
            message: 'test getProductChoices',
            data: product?.product_choice
        });
    }
    catch (error) {
        res.status(400).send({ status: 'failure', message: error.message });
    }
}
exports.default = productRouter;
