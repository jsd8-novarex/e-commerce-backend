"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cart/cartController");
const customerMiddleware_1 = require("../middlewares/customer/customerMiddleware");
const cartMiddleware_1 = require("../middlewares/cart/cartMiddleware");
const productMiddleware_1 = require("../middlewares/product/productMiddleware");
const cartRouter = express_1.default.Router();
cartRouter.get('/', customerMiddleware_1.validateCustomerIdMiddleware, cartController_1.getCartByCustomerId);
cartRouter.post('/', customerMiddleware_1.validateCustomerIdMiddleware, cartMiddleware_1.validateCartByCustomerIdMiddleware, cartController_1.postCurrentCart);
cartRouter.post('/add', productMiddleware_1.validateProductChoiceIdMiddleware, cartMiddleware_1.validateCartByCustomerIdMiddleware, cartController_1.addItemToCart);
cartRouter.post('/quantity', productMiddleware_1.validateProductChoiceIdMiddleware, cartMiddleware_1.validateCartByCustomerIdMiddleware, cartController_1.updateItemQuantity);
cartRouter.post('/delete', productMiddleware_1.validateProductChoiceIdMiddleware, cartMiddleware_1.validateCartByCustomerIdMiddleware, cartController_1.removeItemFromCart);
cartRouter.post('/payment', cartMiddleware_1.validateCartIdMiddleware, cartController_1.postCompleteCart);
exports.default = cartRouter;
