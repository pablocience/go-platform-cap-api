import express from 'express';
import serverless from 'serverless-http';

import routes from './routes';
import { attachUserData, checkJwt } from './middlewares/CheckJWTAuth0';
import { RequestWithUser } from './ts/interfaces';
import { checkXApiKey } from './middlewares/validateApiKey.middleware';

const app = express();

app.use(express.json());
app.use(checkXApiKey);
app.use((req, res, next) => {
  checkJwt(req, res, (err) => {
    if (err) {
      return next(err);
    }
    attachUserData(req as unknown as RequestWithUser, next);
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
