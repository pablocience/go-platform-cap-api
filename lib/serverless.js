const serverlessConfiguration = {
    service: 'go-platform-cap-api',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: {
        api: {
            handler: 'dist/app.handler',
            events: [
                {
                    http: {
                        method: 'get',
                        path: '/api/looker',
                    },
                },
                {
                    http: {
                        method: 'get',
                        path: '/hello',
                    },
                },
            ],
        },
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
        'serverless-offline': {
            httpPort: 8080,
        },
    },
};
export default serverlessConfiguration;
//# sourceMappingURL=serverless.js.map