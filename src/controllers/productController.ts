import { Request, Response, NextFunction } from 'express';
import productModel from '../models/product/productModel';

// GET: Fetch all product
const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { gender } = req.query;
    // เช็ค gender และทำการค้นหาข้อมูลสินค้า
    let products;
    if (gender === "WOMAN") {      
      products = await productModel.find({ gender: "WOMAN" });
    } else if (gender === "MAN") {      
      products = await productModel.find({ gender: "MAN" });
    } else {      
      products = await productModel.find();
    }
    res.status(200).json({
      status: 'success',
      products,
    });
  } catch (error: any) {
    res.status(400).send({ status: 'failure', message: error.message });
  }
};

// GET: Fetch product by ID
const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params; 
    const product = await productModel.findById(productId);

    if (!product) {
      res.status(404).json({
        status: 'failure',
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({ 
      status: 'failure', 
      message: error.message 
    });
  }
};

// GET: Fetch product choice 
const getProductChoice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, choiceId } = req.params; 
    const product = await productModel.findById(productId);

    if (!product) {
      res.status(404).json({
        status: 'failure',
        message: 'Product not found',
      });
      return;
    }

    const productChoice = product.product_choices?.find(
      (choice) => String(choice.id) === String(choiceId)
    );

    if (!productChoice) {
      res.status(404).json({
        status: 'failure',
        message: 'Product choice not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Product choice fetched successfully',
      data: productChoice,
    });
  } catch (error: any) {
    res.status(400).json({ 
      status: 'failure', 
      message: error.message 
    });
  }
};

// POST: Create a new product
const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      gender,
      description,
      product_choices,
      creator_id,
      last_op_id,
    } = req.body;

    if (
      !name ||
      !brand ||
      !category ||
      !gender ||
      !description ||
      !creator_id ||
      !last_op_id
    ) {
      res.status(400).send({
        status: 'failure',
        message: 'Missing required fields',
      });
      return;
    }
    const create_timestamp = new Date();
    const last_updated_timestamp = new Date();

    const newProduct = new productModel({
      name,
      brand,
      category,
      gender,
      description,
      product_choices,
      create_timestamp,
      last_updated_timestamp,
      creator_id,
      last_op_id,
      tram_status: true,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export { getProduct, getProductById,getProductChoice, addProduct };
