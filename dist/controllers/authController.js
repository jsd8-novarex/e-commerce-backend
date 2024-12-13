"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomer = exports.loginCustomer = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const customerModel2_1 = __importDefault(require("../models/customerModel2"));
const customerAddress_1 = __importDefault(require("../models/customerAddress"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const loginCustomer = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email format.' });
            return;
        }
        const user = await customerModel2_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        // สร้าง JWT Token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '1d',
        });
        // ส่ง customerId พร้อม token
        res.status(200).json({
            token,
            customerId: user._id, // เพิ่ม customerId
            email: user.email, // เพิ่ม email
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginCustomer = loginCustomer;
const registerCustomer = async (req, res, next) => {
    try {
        const { email, password1, password2 } = req.body;
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email format.' });
            return;
        }
        if (password1 !== password2) {
            res.status(400).json({ message: 'Passwords do not match.' });
            return;
        }
        const isValidPassword = validator_1.default.isStrongPassword(password1, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });
        if (!isValidPassword) {
            res.status(400).json({
                message: 'Password must be at least 8 characters long with both uppercase and lowercase letters.',
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password1, 10);
        const newUser = await customerModel2_1.default.create({
            email,
            password: hashedPassword,
        });
        // สร้าง Customer Address เป็นค่า default
        await customerAddress_1.default.create({
            customer_id: newUser._id, // ใช้ _id จาก User ที่สร้าง
            postal_code: null,
            province: null,
            district: null,
            subdistrict: null,
            address: null,
            creator_id: newUser._id, // ตั้ง creator เป็นตัวเอง
            last_op_id: newUser._id,
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(201).json({ token });
    }
    catch (error) {
        next(error);
    }
};
exports.registerCustomer = registerCustomer;
