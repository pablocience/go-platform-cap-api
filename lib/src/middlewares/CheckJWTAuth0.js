import { expressjwt } from 'express-jwt';
import axios from 'axios';
import JwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
dotenv.config();
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;
const clientSecret = JwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
});
export const checkJwt = expressjwt({
    secret: clientSecret,
    issuer: `https://${auth0Domain}/`,
    algorithms: ['RS256'],
    audience: auth0Audience,
});
export const attachUserData = async (req, next) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];
    if (accessToken) {
        try {
            const response = await axios.get(`https://${auth0Domain}/userinfo`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            req.user = response.data;
        }
        catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    }
    next();
};
//# sourceMappingURL=CheckJWTAuth0.js.map