#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkVsStack } from './cdk-vs-stack';

const app = new cdk.App();
new CdkVsStack(app, 'CdkVsStack', {
    env: {
        account:"559661177444",
        region: "us-east-2"
    }
});
