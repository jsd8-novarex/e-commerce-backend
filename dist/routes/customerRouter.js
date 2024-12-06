"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
// GET: Fetch all customers
router.get('/', customerController_1.getAllCustomers);
// GET: Fetch customer by ID
router.get('/:id', customerController_1.getCustomerById);
// POST: Create a new customer
router.post('/', customerController_1.createCustomer);
// PUT: Update customer by ID
router.put('/:id', customerController_1.updateCustomer);
exports.default = router;
