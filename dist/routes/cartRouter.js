"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
const express_1 = __importDefault(require("express"));
const getCartRouter = express_1.default.Router();
getCartRouter.get('/', getCart);
async function getCart(req, res, next) {
    try {
        res.status(200).send({
            message: 'test getCart',
        });
    }
    catch (error) {
        res.status(400).send({ status: 'failure', message: error.message });
    }
}
exports.default = getCartRouter;
