#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkVsStack } from '../lib/cdk-vs-stack';

const app = new cdk.App();
new CdkVsStack(app, 'CdkVsStack');
