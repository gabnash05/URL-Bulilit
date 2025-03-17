import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

const dynamoDB = new DynamoDBClient({ region: "ap-southeast-2"});
const TABLE_NAME = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    let lastEvaluatedKey: any = undefined;

    const pq = new MinPriorityQueue<{ shortKey: string, originalUrl: string, clicks: number }>(
      (item) => item.clicks
    );

    do {
      const result = await dynamoDB.send(new ScanCommand({
        TableName: TABLE_NAME,
        ExclusiveStartKey: lastEvaluatedKey,
      }))

      for (const item of result.Items || []) {
        const newItem = {
          shortKey: item.id.S!,
          originalUrl: item.originalUrl.S!,
          clicks: parseInt(item.clicks?.N || "0"),
        };

        pq.enqueue(newItem);

        if (pq.size() > 50) {
          pq.dequeue();
        }
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    const topUrls: any[] = [];
    while (!pq.isEmpty()) {
      topUrls.unshift(pq.dequeue());
    }

    return {
      statusCode: 200,
      body: JSON.stringify(topUrls)
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
}