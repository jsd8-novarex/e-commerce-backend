import express, { Request, Response, NextFunction } from 'express';
import { product_list } from "../constraints/PRODUCT_DATA"

const productRouter = express.Router();
const products = product_list;

productRouter.get('/', getProduct);
productRouter.get('/:productId', getProductById);
productRouter.get('/:productId/choice', getProductChoiceById);

export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(200).send({
      message: 'test getProduct',      
    });
  } catch (error: any) {
    res.status(400).send({ status: 'failure', message: error.message });
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const product = products.find(
      product => String(product.id) === productId
    );
    res.status(200).send({
      message: 'test getProductฺById',
      data: product
    });
  } catch (error: any) {
    res.status(400).send({ status: 'failure', message: error.message });
  }
}

export async function getProductChoiceById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const product = products.find(
      product => String(product.id) === productId
    );
    res.status(200).send({
      message: 'test getProductChoices',
      data: product?.product_choice
    });
  } catch (error: any) {
    res.status(400).send({ status: 'failure', message: error.message });
  }
}

export default productRouter;