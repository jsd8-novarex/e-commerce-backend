'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateCustomerIdMiddleware = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const customerModel2_1 = __importDefault(require('../models/customerModel2'));
const validateCustomerIdMiddleware = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid customer ID' });
      return;
    }
    const isCustomer = await customerModel2_1.default.findById(id);
    if (!isCustomer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};
exports.validateCustomerIdMiddleware = validateCustomerIdMiddleware;
