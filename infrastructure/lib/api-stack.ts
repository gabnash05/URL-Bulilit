import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LambdaStack } from "./lambda-stack";
import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, lambdaStack: LambdaStack, props?: cdk.StackProps) {
    super(scope, id, props);

    // API Gateway
    const api = new apigateway.RestApi(this, "URL-Bulilit-Api");

    // Routes
    this.api.root
      .resourceForPath("shorten")
      .addMethod("POST", new apigateway.LambdaIntegration(lambdaStack.shortenFn));
    
    this.api.root
      .resourceForPath("{id}")
      .addMethod("GET", new apigateway.LambdaIntegration(lambdaStack.redirectFn));

    this.api.root
      .resourceForPath("stats")
      .addMethod("GET", new apigateway.LambdaIntegration(lambdaStack.statsFn));

    // CORS
    api.root.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    });
  }
}