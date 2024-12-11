import express from 'express';
import {
  getAllCustomerAddresses,
  getCustomerAddressById,
  updateCustomerAddress,
  createCustomerAddress,
} from '../controllers/customerAddressController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Apply middleware to all routes
router.use(authenticateToken);

// Define routes
router.get('/', getAllCustomerAddresses); // GET: Fetch all addresses
router.get('/:customer_id', getCustomerAddressById); // GET: Fetch addresses by customer_id
router.post('/', createCustomerAddress); // POST: Create new address
router.put('/:customer_id', updateCustomerAddress); // PUT: Update address by ID

export default router;
