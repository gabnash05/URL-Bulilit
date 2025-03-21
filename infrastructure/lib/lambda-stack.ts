import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class LambdaStack extends cdk.Stack {
  public readonly shortenFn: lambda.Function;
  public readonly redirectFn: lambda.Function;
  public readonly statsFn: lambda.Function;
  public readonly recentFn: lambda.Function;

  constructor(scope: Construct, id: string, table: dynamodb.Table, props?: cdk.StackProps) {
    super(scope, id, props);
      // shortenUrl Lambda Function
      this.shortenFn = new lambda.Function(this, "ShortenFunction", {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "shortenUrl.handler",
        code: lambda.Code.fromAsset("../backend/dist/handlers"),
        environment: { TABLE_NAME: table.tableName },
      });
  
      // redirectUrl Lambda Function
      this.redirectFn = new lambda.Function(this, "RedirectFunction", {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "redirectUrl.handler",
        code: lambda.Code.fromAsset("../backend/dist/handlers"),
        environment: { TABLE_NAME: table.tableName },
      });
  
      // statsUrl Lambda Function
      this.statsFn = new lambda.Function(this, "StatsFunction", {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "statsUrl.handler",
        code: lambda.Code.fromAsset("../backend/dist/handlers"),
        environment: { TABLE_NAME: table.tableName },
      });

      // recentUrl Lambda Function
      this.recentFn = new lambda.Function(this, "RecentFunction", {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "recentUrl.handler",
        code: lambda.Code.fromAsset("../backend/dist/handlers"),
        environment: { 
          TABLE_NAME: table.tableName,
          SORTING_INDEX: "CreatedAtIndex"
         },
      });
    
    // Grant permissions
    table.grantReadWriteData(this.shortenFn);
    table.grantReadWriteData(this.redirectFn);
    table.grantReadData(this.statsFn);
    table.grantReadData(this.recentFn);
  }
}