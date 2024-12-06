"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const productRouter = express_1.default.Router();
productRouter.get('/', productController_1.getProduct);
// productRouter.get('/:id', getProductById);
// productRouter.get('/:id/:choiceId', getProductById);
productRouter.post('/singleproduct', productController_1.getProductById);
productRouter.post('/add', productController_1.addProduct);
exports.default = productRouter;
