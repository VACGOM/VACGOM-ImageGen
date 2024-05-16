import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {generateImage} from "./generator";

export const generate = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const query = event.queryStringParameters;

    const buffer = await generateImage({
        userId: query['userId'],
        diseaseName: query['diseaseName'],
        vaccinationName: query['vaccinationName'],
        inoculationDate: query['inoculationDate'],
        cardImageUrl: query['cardImageUrl'],
        maskImageUrl: query['maskImageUrl'],
        iconImageUrl: query['iconImageUrl'],
    })

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "image/png",
        },
        isBase64Encoded: true,
        body: buffer.toString('base64'),
    };
};
