"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const customerMiddleware_1 = require("../middleware/customer/customerMiddleware");
const cartMiddleware_1 = require("../middleware/cart/cartMiddleware");
const cartRouter = express_1.default.Router();
cartRouter.get('/', customerMiddleware_1.validateCustomerIdMiddleware, cartController_1.getCartByCustomerId);
cartRouter.post('/', customerMiddleware_1.validateCustomerIdMiddleware, cartMiddleware_1.validateCartMiddleware, cartController_1.postCurrentCart);
exports.default = cartRouter;
