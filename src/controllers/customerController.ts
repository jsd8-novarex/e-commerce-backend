import { Request, Response, NextFunction } from 'express';
import customerModel from '../models/customerModel2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import validator from 'validator';

dayjs.extend(utc); // รองรับการทำงานกับ UTC
dayjs.extend(timezone); // รองรับการตั้งเขตเวลา

// ตั้งค่าเขตเวลาประเทศไทย
const THAI_TIMEZONE = 'Asia/Bangkok';
const isValidPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase;
};
// GET: Fetch all customers
export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customers = await customerModel.find();
    res.status(200).json({ status: 'success', data: customers });
  } catch (error) {
    next(error);
  }
};

// GET: Fetch customer by ID
export const getCustomerById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const customerById = await customerModel.findById(id);

    if (!customerById) {
      res.status(404).json({
        status: 'failure',
        message: `Customer with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({ status: 'success', data: customerById });
  } catch (error) {
    next(error);
  }
};
// POST: CREATE CUSTOMER
export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      password1,
      password2,
      mobile_phone,
      date_of_birth,
      creator_id,
    } = req.body;

    // Validate Email
    if (!validator.isEmail(email)) {
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
        message:
          'Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter.',
      });
      return;
    }

    // ตรวจสอบว่าอีเมลมีอยู่ในระบบหรือยัง
    const existingCustomer = await customerModel.findOne({ email });
    if (existingCustomer) {
      res
        .status(400)
        .json({ status: 'failure', message: 'Email already exists.' });
      return;
    }

    // สร้าง Customer ใหม่
    const newCustomer = new customerModel({
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
      create_timestamp: dayjs(savedCustomer.create_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
      last_updated_timestamp: dayjs(savedCustomer.last_updated_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
    };

    res.status(201).json({ status: 'success', data: transformedCustomer });
  } catch (error) {
    next(error);
  }
};
// PUT: UPDATE CUSTOMER
export const updateCustomer = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      mobile_phone,
      date_of_birth,
      last_op_id,
      tram_status,
    } = req.body;

    const existingCustomer = await customerModel.findById(id);
    if (!existingCustomer) {
      res.status(404).json({
        status: 'failure',
        message: `Customer with ID ${id} not found`,
      });
      return;
    }

    if (name) existingCustomer.name = name;
    if (email) existingCustomer.email = email;
    if (password) existingCustomer.password = password;
    if (mobile_phone !== undefined)
      existingCustomer.mobile_phone = mobile_phone;
    if (date_of_birth !== undefined)
      existingCustomer.date_of_birth = date_of_birth;
    if (tram_status !== undefined) existingCustomer.tram_status = tram_status;
    if (last_op_id) existingCustomer.last_op_id = last_op_id;

    existingCustomer.last_updated_timestamp = dayjs()
      .tz(THAI_TIMEZONE)
      .toDate();

    const updatedCustomer = await existingCustomer.save();

    const transformedCustomer = {
      ...updatedCustomer.toObject(),
      create_timestamp: dayjs(updatedCustomer.create_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
      last_updated_timestamp: dayjs(updatedCustomer.last_updated_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
    };

    res.status(200).json({ status: 'success', data: transformedCustomer });
  } catch (error) {
    next(error);
  }
};

export const getCustomerByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const customer = await customerModel.findOne({ email });

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
  } catch (error) {
    next(error);
  }
};
