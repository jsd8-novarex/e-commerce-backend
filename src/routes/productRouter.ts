import express, { Request, Response, NextFunction } from 'express';
import { getProduct, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/productController';

const productRouter = express.Router();

productRouter.get('/', getProduct);
// productRouter.get('/:id', getProductById);
// productRouter.get('/:id/:choiceId', getProductById);
productRouter.post('/singleproduct', getProductById);
productRouter.post('/add', addProduct);

// เพิ่มเส้นทางสำหรับ PUT และ DELETE
productRouter.put('/update/:id', updateProduct); // อัปเดตสินค้าด้วย ID
productRouter.delete('/delete/:id', deleteProduct); // ลบสินค้าด้วย ID

export default productRouter;