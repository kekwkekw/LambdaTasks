import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
const uploadImage = async (event) => {
    return formatJSONResponse({
        message: `Your image has been successfully uploaded!`,
        event,
    });
};
export const main = middyfy(uploadImage);
//# sourceMappingURL=handler.js.map