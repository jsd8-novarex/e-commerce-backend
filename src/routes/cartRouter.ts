import express, { Request, Response, NextFunction } from 'express';

const getCartRouter = express.Router();

getCartRouter.get('/', getCart);

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).send({
      message: 'test getCart',
    });
  } catch (error: any) {
    res.status(400).send({ status: 'failure', message: error.message });
  }
}

export default getCartRouter;