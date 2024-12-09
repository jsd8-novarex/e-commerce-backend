import express, { Request, Response, NextFunction } from 'express';
import { getProduct, getProductById, getProductChoice, addProduct } from  '../controllers/productController';

const productRouter = express.Router();

productRouter.get('/', getProduct);
productRouter.get('/:productId', getProductById);
productRouter.get('/:productId/:choiceId', getProductChoice);
productRouter.post('/add', addProduct);

export default productRouter;