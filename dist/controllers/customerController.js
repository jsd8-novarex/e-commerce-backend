"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getAllCustomers = void 0;
const customerModel_1 = require("../models/customerModel");
// GET: Fetch all customers
const getAllCustomers = async (req, res, next) => {
    try {
        res.status(200).json({ status: 'success', data: customerModel_1.customers });
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
        const customer = customerModel_1.customers.find((customer) => customer.id === id);
        if (!customer) {
            res.status(404).json({
                status: 'failure',
                message: `Customer with ID ${id} not found`,
            });
            return;
        }
        res.status(200).json({ status: 'success', data: customer });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerById = getCustomerById;
// POST: Create a new customer
const createCustomer = async (req, res, next) => {
    try {
        const { id, name, email, password, mobile_phone, date_of_birth, creator_id, } = req.body;
        if (customerModel_1.customers.some((customer) => customer.id === id)) {
            res
                .status(400)
                .json({ status: 'failure', message: 'Customer ID already exists.' });
            return;
        }
        if (!(0, customerModel_1.isValidDate)(date_of_birth)) {
            res
                .status(400)
                .json({ status: 'failure', message: 'Invalid date_of_birth format.' });
            return;
        }
        if (!(0, customerModel_1.isValidEmail)(email)) {
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
        customerModel_1.customers.push(newCustomer);
        res.status(201).json({ status: 'success', data: newCustomer });
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomer = createCustomer;
// PUT: Update customer
const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: newId, name, email, password, mobile_phone, date_of_birth, last_op_id, tram_status, } = req.body;
        const customerIndex = customerModel_1.customers.findIndex((customer) => customer.id === id);
        if (customerIndex === -1) {
            res.status(404).json({
                status: 'failure',
                message: `Customer with ID ${id} not found`,
            });
            return;
        }
        const updatedCustomer = {
            ...customerModel_1.customers[customerIndex],
            id: newId ?? id,
            name: name ?? customerModel_1.customers[customerIndex].name,
            email: email ?? customerModel_1.customers[customerIndex].email,
            password: password ?? customerModel_1.customers[customerIndex].password,
            mobile_phone: mobile_phone ?? customerModel_1.customers[customerIndex].mobile_phone,
            date_of_birth: date_of_birth ?? customerModel_1.customers[customerIndex].date_of_birth,
            last_updated_timestamp: new Date().toISOString(),
            last_op_id: last_op_id ?? customerModel_1.customers[customerIndex].last_op_id,
            tram_status: tram_status ?? customerModel_1.customers[customerIndex].tram_status,
        };
        customerModel_1.customers[customerIndex] = updatedCustomer;
        res.status(200).json({ status: 'success', data: updatedCustomer });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomer = updateCustomer;
