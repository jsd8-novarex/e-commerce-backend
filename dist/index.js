'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const cors_1 = __importDefault(require('cors'));
const indexRouter_1 = __importDefault(require('./routes/indexRouter'));
const mongodb_1 = __importDefault(require('./config/mongodb'));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
(0, mongodb_1.default)();
app.use(
  (0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express_1.default.json());
// app.use(express.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', indexRouter_1.default);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error 😖',
    error: err.message,
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
