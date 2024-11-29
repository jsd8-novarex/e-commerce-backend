import { Request, Response, NextFunction } from 'express';
import { customers, isValidDate, isValidEmail } from '../models/customerModel';

// GET: Fetch all customers
export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
    const customer = customers.find((customer) => customer.id === id);

    if (!customer) {
      res.status(404).json({
        status: 'failure',
        message: `Customer with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({ status: 'success', data: customer });
  } catch (error) {
    next(error);
  }
};

// POST: Create a new customer
export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      id,
      name,
      email,
      password,
      mobile_phone,
      date_of_birth,
      creator_id,
    } = req.body;

    if (customers.some((customer) => customer.id === id)) {
      res
        .status(400)
        .json({ status: 'failure', message: 'Customer ID already exists.' });
      return;
    }

    if (!isValidDate(date_of_birth)) {
      res
        .status(400)
        .json({ status: 'failure', message: 'Invalid date_of_birth format.' });
      return;
    }

    if (!isValidEmail(email)) {
      res
        .status(400)
        .json({ status: 'failure', message: 'Invalid email format.' });
      return;
    }

    const newCustomer = {
      id,
      name,
      email,
      password,
      mobile_phone,
      date_of_birth,
      create_timestamp: new Date().toISOString(),
      last_updated_timestamp: new Date().toISOString(),
      creator_id,
      last_op_id: creator_id,
      tram_status: false,
    };

    customers.push(newCustomer);

    res.status(201).json({ status: 'success', data: newCustomer });
  } catch (error) {
    next(error);
  }
};

// PUT: Update customer
export const updateCustomer = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      id: newId,
      name,
      email,
      password,
      mobile_phone,
      date_of_birth,
      last_op_id,
      tram_status,
    } = req.body;

    const customerIndex = customers.findIndex((customer) => customer.id === id);

    if (customerIndex === -1) {
      res.status(404).json({
        status: 'failure',
        message: `Customer with ID ${id} not found`,
      });
      return;
    }

    const updatedCustomer = {
      ...customers[customerIndex],
      id: newId ?? id,
      name: name ?? customers[customerIndex].name,
      email: email ?? customers[customerIndex].email,
      password: password ?? customers[customerIndex].password,
      mobile_phone: mobile_phone ?? customers[customerIndex].mobile_phone,
      date_of_birth: date_of_birth ?? customers[customerIndex].date_of_birth,
      last_updated_timestamp: new Date().toISOString(),
      last_op_id: last_op_id ?? customers[customerIndex].last_op_id,
      tram_status: tram_status ?? customers[customerIndex].tram_status,
    };

    customers[customerIndex] = updatedCustomer;

    res.status(200).json({ status: 'success', data: updatedCustomer });
  } catch (error) {
    next(error);
  }
};
