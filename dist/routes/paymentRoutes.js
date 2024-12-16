"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/paymentRoutes.js
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
// Route to place order and initiate Stripe payment
router.post('/place-order', paymentController_1.placeOrderStripe);
// Route to verify payment status
router.post('/verify-payment', paymentController_1.verifyStripe);
exports.default = router;
