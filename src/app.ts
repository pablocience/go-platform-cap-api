import express, { Request } from 'express';
import serverless from 'serverless-http';
import cors from 'cors'
import routes from './routes';
import { attachUserData, checkJwt } from './middlewares/CheckJWTAuth0';
import { checkXApiKey } from './middlewares/validateApiKey.middleware';

const corsOptions = {
  origin: '*',
  methods: 'GET,OPTIONS,POST',
  allowedHeaders: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,customer-id,x-api-key,x-looker-key',
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('customer-id', req.headers['customer-id'] as string);
  res.setHeader('x-api-key', req.headers['x-api-key'] as string);
  res.setHeader('x-looker-key', req.headers['x-looker-key'] as string);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,customer-id,x-api-key,x-looker-key');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  
  next();
});
app.use(express.json());
app.use(checkXApiKey);
app.use((req, res, next) => {
  checkJwt(req, res, (err) => {
    if (err) {
      return next(err);
    }
    attachUserData(req as unknown as Request, next);
  });
});
app.use('/', routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).send();
});

export const handler = serverless(app);
