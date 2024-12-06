"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) {
//     res.status(401).json({ message: 'Access denied, no token provided.' });
//     return;
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded as { id: string }; // แนบข้อมูล token ที่ถอดรหัสไปยัง req
//     next(); // เรียกฟังก์ชันถัดไปใน middleware chain
//   } catch (err) {
//     res.status(403).json({ message: 'Invalid token.' });
//   }
// };
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization'); // อ่าน Header
    const token = authHeader && authHeader.split(' ')[1]; // ดึง Token หลังคำว่า "Bearer"
    if (!token) {
        res.status(401).json({ message: 'Access denied, no token provided.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // เพิ่มข้อมูลผู้ใช้ใน Request
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};
exports.authenticateToken = authenticateToken;
