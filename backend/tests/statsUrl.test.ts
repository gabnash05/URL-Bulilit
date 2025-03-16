import { handler } from "../handlers/statsUrl";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";

const dynamoMock = mockClient(DynamoDBClient);

const mockContext: Context = {} as Context;
const mockCallback: Callback = () => {};

describe("URL Stats Lambda", () => {
  beforeEach(() => {
    dynamoMock.reset();
  });

  it("should return an array of URLs with the highest clicks", async () => {
    const mockUrls = [
      { id: { S: "abc123" }, originalUrl: { S: "https://example.com" }, clicks: { N: "100" } },
      { id: { S: "xyz789" }, originalUrl: { S: "https://test.com" }, clicks: { N: "200" } }
    ];
    const mockEvent: APIGatewayProxyEvent = {} as any;

    dynamoMock.on(ScanCommand).resolves({ Items: mockUrls });

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveLength(2);
    expect(responseBody[0]).toEqual({ shortKey: "xyz789", originalUrl: "https://test.com", clicks: 200 });
    expect(responseBody[1]).toEqual({ shortKey: "abc123", originalUrl: "https://example.com", clicks: 100 });
  });

  it("should return 500 on internal server error", async () => {
    const mockEvent: APIGatewayProxyEvent = {} as any;

    dynamoMock.on(ScanCommand).rejects(new Error("DynamoDB Error"));
    
    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toContain("Internal Server Error");
  });
})