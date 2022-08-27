import type {AWS} from '@serverless/typescript';

import hello from './src/functions/hello';

const serverlessConfiguration: AWS = {
    service: 'image-upload-to-s3-lambdavntnk',
    frameworkVersion: '3',
    plugins: [
        'serverless-esbuild',
        'serverless-offline',
        'serverless-s3-sync',
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        profile: 'serverlessUser',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    // import the function via paths
    functions: {hello},
    resources: {
        Resources: {
            ImageUploadToS3: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: 'image-upload-to-s3-13371337',
                    AccessControl: 'Private',
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                "AllowedHeaders": [
                                    "‘*’"
                                ],
                                "AllowedMethods": [
                                    "‘PUT’"
                                ],
                                "AllowedOrigins": [
                                    "‘*’"
                                ]
                    }
                }
            }
        }
    },
    package: {individually: true},
    custom: {
        s3Sync:
            [{bucketName: 'image-upload-to-s3-13371337', localDir: './data'}],
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
