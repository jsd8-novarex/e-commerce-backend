"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Public Routes
router.post('/register', authController_1.registerCustomer);
router.post('/login', authController_1.loginCustomer);
// router.post('/admin/login', adminLogin);
router.post('/check-email', authController_1.checkEmailCustomer);
exports.default = router;
