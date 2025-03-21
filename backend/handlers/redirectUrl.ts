import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDB = new DynamoDBClient({ region: "ap-southeast-2"});
const TABLE_NAME = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const shortKey = event.pathParameters?.id;
    if (!shortKey) {
      return { 
        statusCode: 400, 
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" },
        body: JSON.stringify({ error: "Missing short key" }) 
      };
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
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" },
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
      headers: { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        ...(originalUrl && { Location: originalUrl })  
      },
      body: ""
    };

  } catch (error: unknown) {
    console.error("Error scanning DynamoDB:", error); 
    
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) errorMessage += `: ${error.message}`;

    return { 
      statusCode: 500, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" },
      body: JSON.stringify({ error: errorMessage }) };
  }
};