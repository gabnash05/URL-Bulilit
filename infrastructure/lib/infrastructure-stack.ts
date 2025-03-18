// lib/infrastructure-stack.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DynamoDBStack } from "./dynamodb-stack";
import { LambdaStack } from "./lambda-stack";
import { ApiStack } from "./api-stack";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoDBStack = new DynamoDBStack(this, "DynamoDBStack");
    const lambdaStack = new LambdaStack(this, "LambdaStack", dynamoDBStack.table);
    new ApiStack(this, "ApiStack", lambdaStack);
  }
}