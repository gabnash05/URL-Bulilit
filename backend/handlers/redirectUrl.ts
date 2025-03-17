import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({ region: "ap-southeast-2"});
const TABLE_NAME = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const shortKey = event.pathParameters?.id;
    if (!shortKey) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing short key" }) };
    }

    const result = await dynamoDB.send(new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: shortKey }
      }
    }));

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "URL not found" })
      }
    }

    const originalUrl = result.Item.originalUrl.S!;

    await dynamoDB.send(new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: shortKey },
      },
      UpdateExpression: "SET clicks = clicks + :inc",
      ExpressionAttributeValues: { ":inc": { N: "1" } }
    }));
    
    return {
      statusCode: 301,
      headers: { Location: originalUrl },
      body: ""
    };

  } catch (error: unknown) {
    // console.error("Lambda function error:", error);
    
    let errorMessage = "Internal Server Error";

    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else if (typeof error === "string" && error.trim() !== "") {
      errorMessage += `: ${error}`;
    } else {
      errorMessage += ": An unknown error occurred";
    }

    return { statusCode: 500, body: JSON.stringify({ error: errorMessage }) };
  }
};