"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRouter_1 = __importDefault(require("./productRouter"));
const customerRouter_1 = __importDefault(require("./customerRouter"));
const cartRouter_1 = __importDefault(require("./cartRouter"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const customerAddressRouter_1 = __importDefault(require("./customerAddressRouter"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello, world! This is API 🐳' });
});
router.use('/customer', customerRouter_1.default);
router.use('/product', productRouter_1.default);
router.use('/cart', cartRouter_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/customeraddress', customerAddressRouter_1.default);
router.use('/payment', paymentRoutes_1.default);
exports.default = router;
