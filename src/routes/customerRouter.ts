import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from '../controllers/customerController';

const router = express.Router();

// GET: Fetch all customers
router.get('/', getAllCustomers);

// GET: Fetch customer by ID
router.get('/:id', getCustomerById);

// POST: Create a new customer
router.post('/', createCustomer);

// PUT: Update customer by ID
router.put('/:id', updateCustomer);

export default router;
