import { handler } from "../handlers/shortenUrl"; // Import Lambda function
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";

const dynamoMock = mockClient(DynamoDBClient);

const mockContext: Context = {} as Context;
const mockCallback: Callback = () => {};

describe("URL Shortener Lambda", () => {
  beforeEach(() => {
    dynamoMock.reset();
  });

  it("should return a shortened URL when given a valid URL", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({ url: "https://example.com" }),
    } as any;

    dynamoMock.on(GetItemCommand).resolves({ Item: undefined });
    dynamoMock.on(PutItemCommand).resolves({});

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty("shortenedUrl");
  });

  it("should return 400 if URL is missing", async () => {
    const mockEvent: APIGatewayProxyEvent = { body: "{}" } as any;
    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;
    
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ error: "Missing URL" });
  });

  it("should return 500 on internal server error", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({ url: "https://example.com" }),
    } as any;

    dynamoMock.on(GetItemCommand).rejects(new Error("DynamoDB Error"));

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toContain("Internal Server Error");
  });
});
