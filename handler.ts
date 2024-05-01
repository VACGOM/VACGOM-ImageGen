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
        cardImageUrl: query['cardImageUrl'] ?? "https://images.vacgom.co.kr/%E1%84%87%E1%85%A2%E1%86%A8%E1%84%89%E1%85%B5%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%B8%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%8C%E1%85%B3%E1%86%BC%E1%84%89%E1%85%A5.png"
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
