import express, { Request, Response, NextFunction } from 'express';

const customerRouter = express.Router();

customerRouter.get('/', getCustomers);

export async function getCustomers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(200).send({
      message: 'test getCustomers',
    });
  } catch (error: any) {
    res.status(400).send({ status: 'failure', message: error.message });
  }
}

export default customerRouter;
