import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "ap-southeast-2" });
const TABLE_NAME = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const result = await dynamoDB.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

    const urls = result.Items?.map(item => ({
      shortKey: item.id.S,
      originalUrl: item.originalUrl.S,
      clicks: parseInt(item.clicks.N || "0"),
      createdAt: item.createdAt.S,
    }));

    const sortedUrls = urls
      ?.sort((a, b) => 
        new Date(b.createdAt ?? "1970-01-01").getTime() - 
        new Date(a.createdAt ?? "1970-01-01").getTime()
      )
      .slice(0, 10) || [];

    return { 
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" },
      body: JSON.stringify(sortedUrls) 
    };
  
  } catch (error) {
    console.error("Error scanning DynamoDB:", error);

    let errorMessage = "Internal Server Error";
    if (error instanceof Error) errorMessage += `: ${error.message}`;

    return { 
      statusCode: 500, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" },
      body: JSON.stringify({ error: errorMessage }) 
    };
  }
};