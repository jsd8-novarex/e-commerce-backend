import express from 'express';
import {
  registerCustomer,
  loginCustomer,
  //   adminLogin,
} from '../controllers/authController';

const router = express.Router();

// Public Routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
// router.post('/admin/login', adminLogin);

export default router;
