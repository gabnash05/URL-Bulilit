import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { randomBytes } from 'crypto';

const dynamoDB = new DynamoDBClient({ region: "ap-southeast-2"})
const TABLE_NAME: string = "urls";
 
export const handler: APIGatewayProxyHandler = async(event) => {
  try {
    const body = JSON.parse(event.body || "{}")

    const shortKey = randomBytes(4).toString('hex');
    await dynamoDB.send(new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        id: { S: shortKey },
        originalUrl: { S: body.url },
      }
    }));

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
}