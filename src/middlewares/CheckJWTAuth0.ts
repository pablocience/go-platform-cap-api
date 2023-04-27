import { expressjwt, GetVerificationKey } from 'express-jwt';
import JwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import { NextFunction, Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken';

dotenv.config();
const auth0Domain = process.env.AUTH0_DOMAIN as string;
const auth0Audience = process.env.AUTH0_AUDIENCE as string;
const clientSecret = JwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
});
export const checkJwt = expressjwt({
  secret: clientSecret as GetVerificationKey,
  issuer: `https://${auth0Domain}/`,
  algorithms: ['RS256'],
  audience: auth0Audience,
});

export const attachUserData = async (req: Request, next: NextFunction) => {
  const authHeader = (req.headers as unknown as IncomingHttpHeaders).authorization;
  const accessToken = authHeader?.split(' ')[1] as string;
  if (accessToken) {
    try {
      // const response = await axios.get(`https://${auth0Domain}/userinfo`, {
      //   headers: { Authorization: `Bearer ${accessToken}` },
      // });
      // req.user = response.data;
      const decodedToken = jwt.decode(accessToken) as Request['user'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.user = { ...decodedToken, id: decodedToken.sub };
      req.user.jwt = accessToken;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  }

  next();
};
