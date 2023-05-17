import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export const checkXApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-looker-key'];
    const apiKeys = process.env.GO_CAP_API_KEY;
    const customer_id = req.headers['customer-id'];
    if (apiKey !== apiKeys || !apiKey || !apiKeys) {
      let code = '401UAI-V2-'
      console.log('api',apiKey, "apiKeys", apiKeys);
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
  } catch (error) {
      throw new Error('Internal server error - headers error: ');
  }
};
