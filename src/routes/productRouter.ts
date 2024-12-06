import express, { Request, Response, NextFunction } from 'express';
import { getProduct, getProductById, addProduct } from  '../controllers/productController';

const productRouter = express.Router();

productRouter.get('/', getProduct);
// productRouter.get('/:id', getProductById);
// productRouter.get('/:id/:choiceId', getProductById);
productRouter.post('/singleproduct', getProductById);
productRouter.post('/add', addProduct);

export default productRouter;