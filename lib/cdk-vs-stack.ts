import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as alb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as albTg from '@aws-cdk/aws-elasticloadbalancingv2-targets';

import * as ec2 from '@aws-cdk/aws-ec2';

import { Duration } from '@aws-cdk/core';
import { EventBus } from '@aws-cdk/aws-events';
import { ListenerCondition } from '@aws-cdk/aws-elasticloadbalancingv2';

export class CdkVsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
/* 
    const soediLambda = new lambda.Function(this, "soedi-lambda",{
      functionName: 'jowd-lambda',
      code: lambda.Code.fromAsset('src'),
      handler: "soedi.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(20)
    });

    const roppeLambda = new lambda.Function(this, "roppe-lambda",{
      functionName: 'roppe-lambda',
      code: lambda.Code.fromAsset('src'),
      handler: "roppe.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(20)
    });

    const sender = new lambda.Function(this, "event-sender-lambda",{
      functionName: 'event-sender-lambda',
      code: lambda.Code.fromAsset('src'),
      handler: "eventSender.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(20)
    });

    EventBus.grantPutEvents(sender);

    const targetsoedi = new targets.LambdaFunction(soediLambda, {
      event: events.RuleTargetInput.fromEventPath('$.detail')
    });
    
    const targetroppe = new targets.LambdaFunction(roppeLambda, {
      event: events.RuleTargetInput.fromEventPath('$.detail')
    });

    const rulex = new events.Rule(this, "simple-event", {
      ruleName: "simple-event-rule",
      eventPattern: {
        source: ["xyz-abc"]
      }
    });

    roppeLambda.addPermission("rule-invoke-roppe", {
      principal: new iam.ServicePrincipal("events.amazonaws.com"),
      sourceArn: rulex.ruleArn
    });

    soediLambda.addPermission("rule-invoke-soedi", {
      principal: new iam.ServicePrincipal("events.amazonaws.com"),
      sourceArn: rulex.ruleArn
    });
 */

    /*** S3 *********** */
    // const albLogS3 = new s3.Bucket(this, "alb-access-log",
    // {
    //   bucketName: 'access-alb-check',
    // });

    const lbrock = new lambda.Function(this, "lbrock-lambda",{
      functionName: 'lbrock-lambda',
      code: lambda.Code.fromAsset('src'),
      handler: "lbrock.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(20)
    });

    const vpc = ec2.Vpc.fromLookup(this, "default-vpc", {
      vpcId: "vpc-4b549c20",
    });
    const sg = ec2.SecurityGroup.fromLookup(this, 'def-sg', "sg-5fca8e39");

    const lb = new alb.ApplicationLoadBalancer(this, "my-alb", {
      vpc: vpc,
      securityGroup: sg,
      internetFacing:true,
      loadBalancerName: 'my-alb'
    });

    const listener = lb.addListener("def-listener", {
      port: 80
    });
    const tGrp = listener.addTargets('tg-lbrock', {
      priority: 1,
      targetGroupName:'grp-target-lbrock',
      conditions:[
        ListenerCondition.pathPatterns(['rock'])
      ],
      targets: [
        new albTg.LambdaTarget(lbrock)
      ]
    });
    listener.addTargetGroups("tgrp-lbrock", {
      targetGroups: [tGrp]
    });

  }
}
