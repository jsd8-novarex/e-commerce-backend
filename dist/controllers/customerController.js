"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOldPassword = exports.changePassword = exports.getCustomerByEmail = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getAllCustomers = void 0;
const customerModel2_1 = __importDefault(require("../models/customerModel2"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dayjs_1.default.extend(utc_1.default); // รองรับการทำงานกับ UTC
dayjs_1.default.extend(timezone_1.default); // รองรับการตั้งเขตเวลา
// ตั้งค่าเขตเวลาประเทศไทย
const THAI_TIMEZONE = 'Asia/Bangkok';
// GET: Fetch all customers
const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await customerModel2_1.default.find();
        res.status(200).json({ status: 'success', data: customers });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCustomers = getAllCustomers;
// GET: Fetch customer by ID
const getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customerById = await customerModel2_1.default.findById(id);
        if (!customerById) {
            res.status(404).json({
                status: 'failure',
                message: `Customer with ID ${id} not found`,
            });
            return;
        }
        res.status(200).json({ status: 'success', data: customerById });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerById = getCustomerById;
// POST: CREATE CUSTOMER
const createCustomer = async (req, res, next) => {
    try {
        const { name, email, password1, password2, mobile_phone, date_of_birth, creator_id, } = req.body;
        // Validate Email
        if (!validator_1.default.isEmail(email)) {
            res
                .status(400)
                .json({ status: 'failure', message: 'Invalid email format.' });
            return;
        }
        // Validate Passwords
        if (password1 !== password2) {
            res
                .status(400)
                .json({ status: 'failure', message: 'Passwords do not match.' });
            return;
        }
        const isValidPassword1 = validator_1.default.isStrongPassword(password1, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });
        if (!isValidPassword1) {
            res.status(400).json({
                status: 'failure',
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
            return;
        }
        // Check if email already exists
        const existingCustomer = await customerModel2_1.default.findOne({ email });
        if (existingCustomer) {
            res
                .status(400)
                .json({ status: 'failure', message: 'Email already exists.' });
            return;
        }
        // Hash Password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password1, salt);
        // Create New Customer
        const newCustomer = new customerModel2_1.default({
            name: name || email,
            email,
            password: hashedPassword,
            mobile_phone: mobile_phone || null,
            date_of_birth: date_of_birth || null,
            creator_id,
            last_op_id: creator_id,
        });
        const savedCustomer = await newCustomer.save();
        const transformedCustomer = {
            ...savedCustomer.toObject(),
            create_timestamp: (0, dayjs_1.default)(savedCustomer.create_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
            last_updated_timestamp: (0, dayjs_1.default)(savedCustomer.last_updated_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
        };
        res.status(201).json({
            status: 'success',
            customer: transformedCustomer,
        });
    }
    catch (error) {
        console.error('Error in createCustomer:', error);
        next(error);
    }
};
exports.createCustomer = createCustomer;
// PUT: UPDATE CUSTOMER
const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            res
                .status(400)
                .json({ status: 'failure', message: 'Customer ID is required' });
            return;
        }
        const { name, mobile_phone, date_of_birth, last_op_id, tram_status } = req.body;
        const existingCustomer = await customerModel2_1.default.findById(id);
        if (!existingCustomer) {
            res.status(404).json({
                status: 'failure',
                message: `Customer with ID ${id} not found`,
            });
            return;
        }
        if (name)
            existingCustomer.name = name;
        if (mobile_phone !== undefined)
            existingCustomer.mobile_phone = mobile_phone;
        if (date_of_birth !== undefined)
            existingCustomer.date_of_birth = date_of_birth;
        if (tram_status !== undefined)
            existingCustomer.tram_status = tram_status;
        if (last_op_id)
            existingCustomer.last_op_id = last_op_id;
        existingCustomer.last_updated_timestamp = (0, dayjs_1.default)()
            .tz(THAI_TIMEZONE)
            .toDate();
        const updatedCustomer = await existingCustomer.save();
        const transformedCustomer = {
            ...updatedCustomer.toObject(),
            create_timestamp: (0, dayjs_1.default)(updatedCustomer.create_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
            last_updated_timestamp: (0, dayjs_1.default)(updatedCustomer.last_updated_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
        };
        res.status(200).json({ status: 'success', data: transformedCustomer });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomer = updateCustomer;
const getCustomerByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        if (!email) {
            res.status(400).json({
                status: 'failure',
                message: 'Email parameter is required.',
            });
            return;
        }
        // ค้นหา Customer ใน MongoDB โดยใช้ email
        const customer = await customerModel2_1.default.findOne({ email });
        if (!customer) {
            res.status(404).json({
                status: 'failure',
                message: `Customer with email ${email} not found`,
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: customer,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerByEmail = getCustomerByEmail;
const changePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        // ตรวจสอบว่ามีการส่ง oldPassword และ newPassword มาหรือไม่
        if (!oldPassword || !newPassword) {
            res.status(400).json({
                status: 'failure',
                message: 'Both oldPassword and newPassword are required.',
            });
            return;
        }
        // ดึงข้อมูลลูกค้าจากฐานข้อมูลโดยใช้ ID
        const customer = await customerModel2_1.default.findById(id);
        if (!customer) {
            res.status(404).json({
                status: 'failure',
                message: `Customer with ID ${id} not found.`,
            });
            return;
        }
        // ตรวจสอบว่า oldPassword ตรงกับ password ที่เก็บในฐานข้อมูล
        const isMatch = await bcrypt_1.default.compare(oldPassword, customer.password);
        if (!isMatch) {
            res.status(400).json({
                status: 'failure',
                message: 'Old password is incorrect.',
            });
            return;
        }
        const isValidPassword = validator_1.default.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });
        if (!isValidPassword) {
            res.status(400).json({
                status: 'failure',
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
            return;
        }
        // เข้ารหัส newPassword
        const salt = await bcrypt_1.default.genSalt(10);
        customer.password = await bcrypt_1.default.hash(newPassword, salt);
        await customer.save();
        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
const verifyOldPassword = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของลูกค้าที่จะตรวจสอบ
        const { oldPassword } = req.body; // รับ oldPassword จากคำขอ
        // ตรวจสอบว่ามี oldPassword ส่งมาหรือไม่
        if (!oldPassword) {
            res.status(400).json({
                status: 'failure',
                message: 'Old password is required.',
            });
            return;
        }
        // ค้นหา Customer จากฐานข้อมูลด้วย ID
        const customer = await customerModel2_1.default.findById(id);
        if (!customer) {
            res.status(404).json({
                status: 'failure',
                message: `Customer with ID ${id} not found.`,
            });
            return;
        }
        // ตรวจสอบว่า oldPassword ตรงกับ password ในฐานข้อมูลหรือไม่
        const isMatch = await bcrypt_1.default.compare(oldPassword, customer.password);
        if (!isMatch) {
            res.status(400).json({
                status: 'failure',
                isValid: false,
                message: 'Old password is incorrect.',
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            isValid: true,
            message: 'Old password is valid.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOldPassword = verifyOldPassword;
