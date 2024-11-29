"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = getProduct;
const express_1 = __importDefault(require("express"));
const productRouter = express_1.default.Router();
productRouter.get('/', getProduct);
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
exports.default = productRouter;
