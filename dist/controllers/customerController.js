"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerByEmail = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getAllCustomers = void 0;
const customerModel2_1 = __importDefault(require("../models/customerModel2"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const validator_1 = __importDefault(require("validator"));
dayjs_1.default.extend(utc_1.default); // รองรับการทำงานกับ UTC
dayjs_1.default.extend(timezone_1.default); // รองรับการตั้งเขตเวลา
// ตั้งค่าเขตเวลาประเทศไทย
const THAI_TIMEZONE = 'Asia/Bangkok';
const isValidPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase;
};
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
        if (!isValidPassword(password1)) {
            res.status(400).json({
                status: 'failure',
                message: 'Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter.',
            });
            return;
        }
        // ตรวจสอบว่าอีเมลมีอยู่ในระบบหรือยัง
        const existingCustomer = await customerModel2_1.default.findOne({ email });
        if (existingCustomer) {
            res
                .status(400)
                .json({ status: 'failure', message: 'Email already exists.' });
            return;
        }
        // สร้าง Customer ใหม่
        const newCustomer = new customerModel2_1.default({
            name: name || email,
            email,
            password: password1, // ใช้ password1 หลังจากตรวจสอบ
            mobile_phone: mobile_phone || null,
            date_of_birth: date_of_birth || null,
            creator_id,
            last_op_id: creator_id,
        });
        const savedCustomer = await newCustomer.save();
        // แปลงเวลาเป็นเขตเวลาไทยก่อนส่งกลับ
        const transformedCustomer = {
            ...savedCustomer.toObject(),
            create_timestamp: (0, dayjs_1.default)(savedCustomer.create_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
            last_updated_timestamp: (0, dayjs_1.default)(savedCustomer.last_updated_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
        };
        res.status(201).json({ status: 'success', data: transformedCustomer });
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomer = createCustomer;
// PUT: UPDATE CUSTOMER
const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password, mobile_phone, date_of_birth, last_op_id, tram_status, } = req.body;
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
        if (email)
            existingCustomer.email = email;
        if (password)
            existingCustomer.password = password;
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
// export const getAllCustomers = async (req: Request, res: Response) => {
//   const customers = await customerModel.find();
//   res.status(200).json(customers);
// };
// export const getSignedInCustomer = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id; // ดึง id จาก JWT
//     if (!userId) {
//       res
//         .status(400)
//         .json({ message: 'Token ไม่ถูกต้อง หรือไม่มีข้อมูลผู้ใช้งาน' });
//       return;
//     }
//     const customer = await customerModel.findById(userId);
//     if (!customer) {
//       res.status(404).json({ message: 'ไม่พบข้อมูลลูกค้า' });
//       return;
//     }
//     const transformedCustomer = {
//       ...customer.toObject(),
//       create_timestamp: dayjs(customer.create_timestamp)
//         .tz(THAI_TIMEZONE)
//         .format('YYYY-MM-DD HH:mm:ss'),
//       last_updated_timestamp: dayjs(customer.last_updated_timestamp)
//         .tz(THAI_TIMEZONE)
//         .format('YYYY-MM-DD HH:mm:ss'),
//     };
//     res.status(200).json({ status: 'success', data: transformedCustomer });
//   } catch (error) {
//     next(error);
//   }
// };
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
