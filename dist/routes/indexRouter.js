"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRouter_1 = __importDefault(require("./productRouter"));
const customerRouter_1 = __importDefault(require("./customerRouter"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello, world! This is API' });
});
router.use('/customer', customerRouter_1.default);
router.use('/product', productRouter_1.default);
router.use('/api/auth', authRoutes_1.default);
exports.default = router;
