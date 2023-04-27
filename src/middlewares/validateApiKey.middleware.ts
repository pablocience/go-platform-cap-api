import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const apiKeys = process.env.GO_CAP_API_KEY;
export const checkXApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const customer_id = req.headers['customer-id'];
  if (apiKey !== apiKeys || !apiKey || !apiKeys) {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      error:'401UAI'
    });
  }
  if (!customer_id || customer_id === '') {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      error:'401UCI'
    });
  }
  return next();
};
