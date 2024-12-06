"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken); // ทุก Route ต้องผ่านการตรวจสอบ JWT
router.get('/', customerController_1.getAllCustomers); // ดึงข้อมูลลูกค้าทั้งหมด (เฉพาะ Admin)
// router.get('/profile', getSignedInCustomer); // ดึงข้อมูลโปรไฟล์ลูกค้าที่เข้าสู่ระบบ
router.get('/:id', customerController_1.getCustomerById); // ดึงข้อมูลลูกค้าด้วย ID
router.post('/', customerController_1.createCustomer); // สร้างข้อมูลลูกค้าใหม่
router.put('/:id', customerController_1.updateCustomer); // อัปเดตข้อมูลลูกค้า
router.get('/email/:email', customerController_1.getCustomerByEmail);
exports.default = router;
