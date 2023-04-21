import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import serverless from 'serverless-http';
import cors from 'cors';
import { getDashboardURLController } from './src/controllers/looker.controller';
import { config } from 'dotenv';
import { checkXApiKey } from './src/middlewares/validateApiKey.middleware';
import { attachUserData, checkJwt } from 'src/middlewares/CheckJWTAuth0';
import { RequestWithUser } from '@ts/interfaces';

config();
const port = process.env.PORT;
const app: Application = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost',
    'https://localhost:3000',
    'https://dev.gocience.com/',
    'https://app.gocience.com/',
    'https://gocience.com/',
  ],
};
const wrapAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(checkXApiKey);
app.use(bodyParser.json());
app.use((req, res, next) => {
  checkJwt(req, res, (err) => {
    if (err) {
      return next(err);
    }
    attachUserData(req as unknown as RequestWithUser, next);
  });
});

app.get('/api/looker', wrapAsync(getDashboardURLController));

export const handler = serverless(app);