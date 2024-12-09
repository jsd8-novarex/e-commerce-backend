import express, { Request, Response, NextFunction } from 'express';
import { getProduct, getProductById, getProductChoice, addProduct } from  '../controllers/productController';

const productRouter = express.Router();

productRouter.get('/', getProduct);
productRouter.get('/:productId', getProductById);
productRouter.get('/:productId/:choiceId', getProductChoice);
productRouter.post('/add', addProduct);

// เพิ่มเส้นทางสำหรับ PUT และ DELETE
productRouter.put('/update/:id', updateProduct); // อัปเดตสินค้าด้วย ID
productRouter.delete('/delete/:id', deleteProduct); // ลบสินค้าด้วย ID

export default productRouter;