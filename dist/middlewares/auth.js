'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // ค้นหา Bearer Token
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Access Denied. No token provided.' });
  }
  try {
    const decoded = jsonwebtoken_1.default.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token.' });
  }
};
exports.verifyToken = verifyToken;
