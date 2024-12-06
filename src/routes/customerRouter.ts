import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  getCustomerByEmail,
} from '../controllers/customerController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.get('/email/:email', getCustomerByEmail);

export default router;
