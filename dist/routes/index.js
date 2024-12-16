'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const customerRouter_1 = require('./customerRouter');
const productRouter_1 = require('./productRouter');
const router = express_1.default.Router();
router.get('/', (req, res) => {
  res.json('Hello, world! This is API');
});
router.use('/customer', customerRouter_1.customerRouter);
router.use('/product', productRouter_1.productRouter);
exports.default = router;
