"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
router.get('/', customerController_1.getAllCustomers);
router.get('/:id', customerController_1.getCustomerById);
router.post('/', customerController_1.createCustomer);
router.put('/:id', customerController_1.updateCustomer);
router.get('/email/:email', customerController_1.getCustomerByEmail);
exports.default = router;
