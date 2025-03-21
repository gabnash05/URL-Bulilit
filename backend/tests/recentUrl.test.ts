import { handler } from "../handlers/recentUrl";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";

const dynamoMock = mockClient(DynamoDBClient);

const mockContext: Context = {} as Context;
const mockCallback: Callback = () => {};

describe("URL Recent Lambda", () => {
  beforeEach(() => {
    dynamoMock.reset();
  });

  it("should return an array of 10 most recent URLs", async () => {
    const mockUrls = [
      { id: { S: "abc123" }, originalUrl: { S: "https://example.com" }, clicks: { N: "100" }, createdAt: { S: "2025-03-21T12:34:56.789Z"} },
      { id: { S: "xyz789" }, originalUrl: { S: "https://test.com" }, clicks: { N: "200" }, createdAt: { S: "2025-03-20T12:34:56.789Z"} }
    ];
    const mockEvent: APIGatewayProxyEvent = {} as any;

    dynamoMock.on(QueryCommand).resolves({ Items: mockUrls });

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveLength(2);
    expect(responseBody[1]).toEqual({ shortKey: "xyz789", originalUrl: "https://test.com", clicks: 200, createdAt: "2025-03-20T12:34:56.789Z" });
    expect(responseBody[0]).toEqual({ shortKey: "abc123", originalUrl: "https://example.com", clicks: 100, createdAt: "2025-03-21T12:34:56.789Z" });
  });

  it("should return 500 on internal server error", async () => {
    const mockEvent: APIGatewayProxyEvent = {} as any;

    dynamoMock.on(ScanCommand).rejects(new Error("DynamoDB Error"));
    
    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toContain("Internal Server Error");
  });
})