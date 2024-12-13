"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerAddressController_1 = require("../controllers/customerAddressController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Apply middleware to all routes
router.use(authMiddleware_1.authenticateToken);
// Define routes
router.get('/', customerAddressController_1.getAllCustomerAddresses); // GET: Fetch all addresses
router.get('/:customer_id', customerAddressController_1.getCustomerAddressById); // GET: Fetch addresses by customer_id
router.post('/', customerAddressController_1.createCustomerAddress); // POST: Create new address
router.put('/:customer_id', customerAddressController_1.updateCustomerAddress); // PUT: Update address by ID
exports.default = router;
