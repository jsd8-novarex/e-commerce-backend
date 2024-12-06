"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCustomer = exports.registerCustomer = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const customerModel2_1 = __importDefault(require("../models/customerModel2"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const registerCustomer = async (req, res, next) => {
    try {
        const { name, email, password1, password2 } = req.body;
        // ตรวจสอบว่าอีเมลถูกต้อง
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email format.' });
            return;
        }
        // ตรวจสอบว่ารหัสผ่านเหมือนกันหรือไม่
        if (password1 !== password2) {
            res.status(400).json({ message: 'Passwords do not match.' });
            return;
        }
        // ตรวจสอบรูปแบบรหัสผ่าน
        const isValidPassword = validator_1.default.isStrongPassword(password1, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 0, // ปิดการบังคับว่าต้องมีตัวเลข
            minSymbols: 0, // ปิดการบังคับว่าต้องมีสัญลักษณ์พิเศษ
        });
        if (!isValidPassword) {
            res.status(400).json({
                message: 'Password must be at least 8 characters long with both uppercase and lowercase letters.',
            });
            return;
        }
        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt_1.default.hash(password1, 10);
        // สร้างผู้ใช้ใหม่
        const newUser = await customerModel2_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        // สร้าง JWT Token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(201).json({ token });
    }
    catch (error) {
        next(error); // ส่งต่อข้อผิดพลาดไปยัง middleware ที่จัดการ error
    }
};
exports.registerCustomer = registerCustomer;
const loginCustomer = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // ตรวจสอบว่าอีเมลถูกต้อง
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email format.' });
            return;
        }
        const user = await customerModel2_1.default.findOne({ email });
        // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        // สร้าง JWT Token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(200).json({ token });
    }
    catch (error) {
        next(error); // ส่งต่อข้อผิดพลาดไปยัง middleware ที่จัดการ error
    }
};
exports.loginCustomer = loginCustomer;
