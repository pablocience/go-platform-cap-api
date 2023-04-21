import dotenv from 'dotenv';
dotenv.config();
const apiKeys = process.env.GO_API_KEY;
export const checkXApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const customer_id = req.headers['customer-id'];
    if (apiKey !== apiKeys || !apiKey || !apiKeys) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized',
        });
    }
    if (!customer_id || customer_id === '') {
        return res.status(401).json({
            status: 400,
            message: 'Missing customer-id auth header',
        });
    }
    return next();
};
//# sourceMappingURL=validateApiKey.middleware.js.map