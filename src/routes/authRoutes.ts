import express from 'express';
import {
  registerCustomer,
  loginCustomer,
  //   adminLogin,
  checkEmailCustomer,
} from '../controllers/authController';

const router = express.Router();

// Public Routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
// router.post('/admin/login', adminLogin);
router.post('/check-email', checkEmailCustomer);

export default router;
