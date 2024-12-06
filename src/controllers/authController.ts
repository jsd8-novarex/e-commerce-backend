import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import customerModel from '../models/customerModel2';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const registerCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password1, password2 } = req.body;

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: 'Invalid email format.' });
      return;
    }

    if (password1 !== password2) {
      res.status(400).json({ message: 'Passwords do not match.' });
      return;
    }

    const isValidPassword = validator.isStrongPassword(password1, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isValidPassword) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters long with both uppercase and lowercase letters.',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password1, 10);

    const newUser = await customerModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

export const loginCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: 'Invalid email format.' });
      return;
    }

    const user = await customerModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    // สร้าง JWT Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
