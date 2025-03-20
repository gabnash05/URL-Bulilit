import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LambdaStack } from "./lambda-stack";
import { Construct } from "constructs";

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, lambdaStack: LambdaStack, props?: cdk.StackProps) {
    super(scope, id, props);

    // ✅ Use default CORS options (Avoid duplicate OPTIONS)
    this.api = new apigateway.RestApi(this, "URL-Bulilit-Api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token"],
      },
    });

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
  }
}
