import { Request, Response, NextFunction } from 'express';
import customerAddressModel from '../models/customerAddress';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const THAI_TIMEZONE = 'Asia/Bangkok';

// GET: Fetch all customer addresses
export const getAllCustomerAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerAddresses = await customerAddressModel.find();
    res.status(200).json({ status: 'success', data: customerAddresses });
  } catch (error) {
    next(error);
  }
};

// GET: Fetch customer addresses by customer_id
export const getCustomerAddressById = async (
  req: Request<{ customer_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id } = req.params;

    // ค้นหาที่ customer_id
    const addresses = await customerAddressModel.find({ customer_id });

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
      create_timestamp: dayjs(address.create_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
      last_update_timestamp: dayjs(address.last_update_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
    }));

    res.status(200).json({ status: 'success', data: transformedAddresses });
  } catch (error) {
    next(error);
  }
};

// POST: Create new customer address
export const createCustomerAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      customer_id,
      postal_code,
      province,
      district,
      subdistrict,
      address,
      creator_id,
    } = req.body;

    const newAddress = new customerAddressModel({
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
      create_timestamp: dayjs(savedAddress.create_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
      last_update_timestamp: dayjs(savedAddress.last_update_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
    };

    res.status(201).json({ status: 'success', data: transformedAddress });
  } catch (error) {
    next(error);
  }
};

// PUT: Update customer address
// PUT: Update customer address using customer_id
export const updateCustomerAddress = async (
  req: Request<{ customer_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id } = req.params;
    const updateData = req.body;

    // ค้นหาและอัปเดตข้อมูลทั้งหมดที่ตรงกับ customer_id
    const updatedAddresses = await customerAddressModel.updateMany(
      { customer_id },
      {
        ...updateData,
        last_update_timestamp: dayjs().tz(THAI_TIMEZONE).toDate(),
      }
    );

    if (updatedAddresses.matchedCount === 0) {
      res.status(404).json({
        status: 'failure',
        message: `No addresses found for customer_id ${customer_id}.`,
      });
      return;
    }

    const refreshedAddresses = await customerAddressModel.find({ customer_id });

    const transformedAddresses = refreshedAddresses.map((address) => ({
      ...address.toObject(),
      create_timestamp: dayjs(address.create_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
      last_update_timestamp: dayjs(address.last_update_timestamp)
        .tz(THAI_TIMEZONE)
        .format('YYYY-MM-DD HH:mm:ss'),
    }));

    res.status(200).json({
      status: 'success',
      message: `${updatedAddresses.modifiedCount} address(es) updated successfully.`,
      data: transformedAddresses,
    });
  } catch (error) {
    next(error);
  }
};
