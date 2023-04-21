import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import httpJsonBodyParser from '@middy/http-json-body-parser';
const hello = async (event) => {
    return formatJSONResponse({
        message: `Hello, welcome to the exciting Serverless world!`,
        event,
    });
};
export const main = middyfy(hello).use(httpJsonBodyParser());
//# sourceMappingURL=handler.js.map