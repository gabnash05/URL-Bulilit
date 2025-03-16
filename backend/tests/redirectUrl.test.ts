import { handler } from "../handlers/redirectUrl"; // Import Lambda function
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";

const dynamoMock = mockClient(DynamoDBClient);

const mockContext: Context = {} as Context;
const mockCallback: Callback = () => {};

describe("URL Redirect Lambda", () => {
  beforeEach(() => {
    dynamoMock.reset(); // Reset mock data before each test
  });

  it("should redirect shortened URLs to the original URLs", async () => {
    const mockOriginalUrl = "https://example.com";

    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {id: "abc123"},
    } as any;

    dynamoMock.on(GetItemCommand).resolves({ Item: { originalUrl: { S: mockOriginalUrl } } });
    dynamoMock.on(UpdateItemCommand).resolves({});

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(301);
    expect(response.headers).toHaveProperty("Location", mockOriginalUrl);
    expect(response.body).toBe("");
  });

  it("should return 400 if shortKey is missing", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {},
    } as any;

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ error: "Missing short key" });
  });

  it("should return 404 if URL is not found", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {id: "abc123"},
    } as any;

    dynamoMock.on(GetItemCommand).resolves({}); 

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ error: "URL not found" });
  });

  it("should return 500 on internal server error", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {id: "abc123"},
    } as any;

    dynamoMock.on(GetItemCommand).rejects(new Error("DynamoDB Error"));

    const response = (await handler(mockEvent, mockContext, mockCallback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toContain("Internal Server Error");
  });
})