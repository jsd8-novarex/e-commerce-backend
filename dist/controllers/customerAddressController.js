"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerAddress = exports.createCustomerAddress = exports.getCustomerAddressById = exports.getAllCustomerAddresses = void 0;
const customerAddress_1 = __importDefault(require("../models/customerAddress"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const THAI_TIMEZONE = 'Asia/Bangkok';
// GET: Fetch all customer addresses
const getAllCustomerAddresses = async (req, res, next) => {
    try {
        const customerAddresses = await customerAddress_1.default.find();
        res.status(200).json({ status: 'success', data: customerAddresses });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCustomerAddresses = getAllCustomerAddresses;
// GET: Fetch customer addresses by customer_id
const getCustomerAddressById = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        // ค้นหาที่ customer_id
        const addresses = await customerAddress_1.default.find({ customer_id });
        if (!addresses || addresses.length === 0) {
            res.status(404).json({
                status: 'failure',
                message: `No addresses found for customer_id ${customer_id}.`,
            });
            return;
        }
        // แปลงข้อมูล timestamp ให้เป็น timezone ที่ต้องการ
        const transformedAddresses = addresses.map((address) => ({
            ...address.toObject(),
            create_timestamp: (0, dayjs_1.default)(address.create_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
            last_update_timestamp: (0, dayjs_1.default)(address.last_update_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
        }));
        res.status(200).json({ status: 'success', data: transformedAddresses });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerAddressById = getCustomerAddressById;
// POST: Create new customer address
const createCustomerAddress = async (req, res, next) => {
    try {
        const { customer_id, postal_code, province, district, subdistrict, address, creator_id, } = req.body;
        const newAddress = new customerAddress_1.default({
            customer_id,
            postal_code,
            province,
            district,
            subdistrict,
            address,
            creator_id,
            last_op_id: creator_id,
        });
        const savedAddress = await newAddress.save();
        const transformedAddress = {
            ...savedAddress.toObject(),
            create_timestamp: (0, dayjs_1.default)(savedAddress.create_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
            last_update_timestamp: (0, dayjs_1.default)(savedAddress.last_update_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
        };
        res.status(201).json({ status: 'success', data: transformedAddress });
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomerAddress = createCustomerAddress;
// PUT: Update customer address
// PUT: Update customer address using customer_id
const updateCustomerAddress = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const updateData = req.body;
        // ค้นหาและอัปเดตข้อมูลทั้งหมดที่ตรงกับ customer_id
        const updatedAddresses = await customerAddress_1.default.updateMany({ customer_id }, {
            ...updateData,
            last_update_timestamp: (0, dayjs_1.default)().tz(THAI_TIMEZONE).toDate(),
        });
        if (updatedAddresses.matchedCount === 0) {
            res.status(404).json({
                status: 'failure',
                message: `No addresses found for customer_id ${customer_id}.`,
            });
            return;
        }
        const refreshedAddresses = await customerAddress_1.default.find({ customer_id });
        const transformedAddresses = refreshedAddresses.map((address) => ({
            ...address.toObject(),
            create_timestamp: (0, dayjs_1.default)(address.create_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
            last_update_timestamp: (0, dayjs_1.default)(address.last_update_timestamp)
                .tz(THAI_TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss'),
        }));
        res.status(200).json({
            status: 'success',
            message: `${updatedAddresses.modifiedCount} address(es) updated successfully.`,
            data: transformedAddresses,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomerAddress = updateCustomerAddress;
