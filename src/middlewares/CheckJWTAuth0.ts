import { expressjwt, GetVerificationKey } from 'express-jwt';
import axios from 'axios';
import JwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import { NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { RequestWithUser } from '@ts/interfaces';

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

export const attachUserData = async (req: RequestWithUser, next: NextFunction) => {
  const authHeader = (req.headers as unknown as IncomingHttpHeaders).authorization;
  const accessToken = authHeader?.split(' ')[1] as string;
  if (accessToken) {
    try {
      const response = await axios.get(`https://${auth0Domain}/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      req.user = response.data;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  }

  next();
};
