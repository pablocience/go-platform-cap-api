import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const checkXApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-looker-key'];
  const apiKeys = process.env.GO_CAP_API_KEY;
  const customer_id = req.headers['customer-id'];
  if (apiKey !== apiKeys || !apiKey || !apiKeys) {
    let code = '401UAI-'
    if(apiKey !== apiKeys) code += 'DF'
    if(!apiKey) code += 'NAK'
    if(!apiKeys) code += 'NENVAK'
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      error:code
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
