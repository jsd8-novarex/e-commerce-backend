import express, { Request, Response, NextFunction } from 'express';

const productRouter = express.Router();

productRouter.get('/', getProduct);

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

export default productRouter;
