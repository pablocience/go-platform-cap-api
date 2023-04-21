import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
const hello = async (event) => {
    return formatJSONResponse({
        message: `Hello, welcome to the exciting Serverless world!`,
        event,
    });
};
export const main = middyfy(hello);
//# sourceMappingURL=handler.js.map