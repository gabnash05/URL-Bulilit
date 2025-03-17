import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { createHash } from 'crypto';

const dynamoDB = new DynamoDBClient({ region: "ap-southeast-2"});
const TABLE_NAME = process.env.TABLE_NAME;
 
export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const { url } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing URL" }),
      };
    }

    const shortKey = createHash("sha256").update(url).digest("hex").slice(0, 5);

    const urlExists = await dynamoDB.send(new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: shortKey }
      }
    }));

    if (!urlExists.Item) {
      await dynamoDB.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          id: { S: shortKey },
          originalUrl: { S: url },
          clicks: { N: "0"},
        }
      }));
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ shortenedUrl: `https://DOMANNAME.com/${shortKey}`}),
    };

  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";

    if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
    } else if (typeof error === "string") {
        errorMessage += `: ${error}`;
    } else {
        errorMessage += `: An unknown error occurred`;
    }

    return { statusCode: 500, body: JSON.stringify({ error: errorMessage }) };
  }
};