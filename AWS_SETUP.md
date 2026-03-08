# AWS Integration Setup Guide

This guide explains how to connect your BolBharat app with AWS services and test scheme fetching.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Basic understanding of API Gateway and Lambda

## Architecture Overview

```
BolBharat Mobile App
       ↓
   AWS API Gateway (REST API)
       ↓
   AWS Lambda Functions
       ↓
   AWS Services (Bedrock, DynamoDB, S3)
```

## Step 1: Configure API Gateway URL

### Option A: Using Environment Variables (Recommended for Production)

1. Update the `.env` file in `BolBharatApp/.env`:

```env
API_GATEWAY_URL=https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod
AWS_REGION=ap-south-1
```

### Option B: Using app.json (For Expo builds)

The API Gateway URL is already configured in `app.json`:

```json
"extra": {
  "apiGatewayUrl": "https://your-api-gateway-id.execute-api.ap-south-1.amazonaws.com/prod",
  "awsRegion": "ap-south-1"
}
```

Update this URL with your actual API Gateway endpoint.

## Step 2: Deploy AWS Infrastructure

### Required AWS Services

1. **API Gateway**: REST API with the following endpoints
   - `POST /schemes/search` - Search for schemes
   - `GET /schemes/{schemeId}` - Get scheme details
   - `POST /schemes/recommendations` - Get personalized recommendations
   - `POST /schemes/{schemeId}/eligibility` - Check eligibility
   - `POST /forms/submit` - Submit application
   - `GET /forms/applications` - List applications
   - `POST /documents/process` - Process documents with OCR
   - `GET /users/{userId}` - Get user profile
   - `PUT /users/{userId}` - Update user profile

2. **AWS Lambda**: Serverless functions for each endpoint

3. **Amazon DynamoDB**: Store schemes, applications, and user data

4. **AWS Bedrock**: AI-powered scheme matching and document simplification

5. **Amazon Textract**: OCR for document processing

6. **AWS Cognito**: User authentication (already configured)

### Quick Deploy with AWS SAM (Recommended)

Create a `template.yaml` file:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: BolBharat Backend Infrastructure

Globals:
  Function:
    Timeout: 30
    Runtime: nodejs18.x
    Environment:
      Variables:
        SCHEMES_TABLE: !Ref SchemesTable
        APPLICATIONS_TABLE: !Ref ApplicationsTable

Resources:
  # API Gateway
  BolBharatApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Cors:
        AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
        AllowHeaders: "'Content-Type,Authorization'"
        AllowOrigin: "'*'"
      Auth:
        DefaultAuthorizer: CognitoAuthorizer
        Authorizers:
          CognitoAuthorizer:
            UserPoolArn: arn:aws:cognito-idp:eu-north-1:ACCOUNT_ID:userpool/eu-north-1_1Up1EJKzi

  # Lambda Functions
  SearchSchemesFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/lambdas/schemes/
      Handler: search.handler
      Events:
        SearchSchemes:
          Type: Api
          Properties:
            RestApiId: !Ref BolBharatApi
            Path: /schemes/search
            Method: post

  # DynamoDB Tables
  SchemesTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: BolBharat-Schemes
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: schemeId
          AttributeType: S
      KeySchema:
        - AttributeName: schemeId
          KeyType: HASH

Outputs:
  ApiEndpoint:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${BolBharatApi}.execute-api.${AWS::Region}.amazonaws.com/prod"
```

Deploy:

```bash
sam build
sam deploy --guided
```

## Step 3: Test the Integration

### Using the Mobile App

1. Install dependencies:

```bash
cd BolBharatApp
npm install
```

2. Run the app:

```bash
npx expo start
```

3. Navigate to the Schemes screen and try searching for schemes

### Using cURL (For API Testing)

Test scheme search:

```bash
curl -X POST https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod/schemes/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_COGNITO_TOKEN" \
  -d '{
    "query": "farming",
    "category": "agriculture",
    "filters": {}
  }'
```

## Step 4: Mock Backend for Development (Optional)

If you don't have AWS infrastructure set up yet, you can use a mock server:

1. Install json-server:

```bash
npm install -g json-server
```

2. Create `db.json`:

```json
{
  "schemes": [
    {
      "id": "1",
      "name": "PM Kisan Samman Nidhi",
      "category": "Agriculture",
      "description": "Direct income support to farmers",
      "benefits": "₹6,000 per year",
      "eligibility": ["Farmer", "Land owner"]
    }
  ]
}
```

3. Run mock server:

```bash
json-server --watch db.json --port 3000
```

4. Update `.env`:

```env
API_GATEWAY_URL=http://localhost:3000
```

## API Service Usage in Code

The app uses a centralized API service (`src/services/awsApi.js`):

```javascript
// Importing the API service
import { schemesApi } from '../services/awsApi';

// Redux slice usage
export const fetchSchemes = createAsyncThunk(
  'schemes/fetchSchemes',
  async ({ query, category, filters }) => {
    const data = await schemesApi.searchSchemes({
      query,
      category,
      filters,
    });
    return data;
  }
);
```

## Authentication Flow

The API service automatically includes Cognito authentication:

1. User signs in via Cognito (Phone OTP)
2. App receives ID token
3. API service attaches token to all requests
4. API Gateway validates token
5. Lambda functions process authenticated requests

## Error Handling

The API service includes built-in error handling:

```javascript
try {
  const schemes = await schemesApi.searchSchemes({ query: 'farming' });
  console.log(schemes);
} catch (error) {
  console.error('Failed to fetch schemes:', error.message);
}
```

## Environment-Specific Configuration

### Development
```env
API_GATEWAY_URL=https://dev-api.execute-api.ap-south-1.amazonaws.com/dev
NODE_ENV=development
```

### Production
```env
API_GATEWAY_URL=https://prod-api.execute-api.ap-south-1.amazonaws.com/prod
NODE_ENV=production
```

## Troubleshooting

### Issue: "Network request failed"
- Check if API Gateway URL is correct
- Verify network connectivity
- Check CORS configuration

### Issue: "Unauthorized"
- Ensure user is logged in
- Verify Cognito token is valid
- Check API Gateway authorizer configuration

### Issue: "No data returned"
- Check Lambda function logs in CloudWatch
- Verify DynamoDB tables have data
- Test API endpoints directly with Postman

## Next Steps

1. Deploy AWS infrastructure using SAM or CDK
2. Populate schemes data in DynamoDB
3. Configure AWS Bedrock for AI features
4. Set up monitoring with CloudWatch
5. Configure API Gateway custom domain
6. Enable caching for better performance

## Resources

- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Expo Documentation](https://docs.expo.dev/)

## Support

For issues or questions, please refer to:
- Project documentation in `/Docs`
- AWS Support Center
- React Native community forums
