import { Amplify } from 'aws-amplify';
import Constants from 'expo-constants';

const API_GATEWAY_URL = 
  Constants.expoConfig?.extra?.apiGatewayUrl ||
  process.env.API_GATEWAY_URL ||
  'https://your-api-gateway-id.execute-api.ap-south-1.amazonaws.com/prod';

const AWS_REGION = 
  Constants.expoConfig?.extra?.awsRegion ||
  process.env.AWS_REGION ||
  'ap-south-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_1Up1EJKzi',
      userPoolClientId: '5n0p70bejc4ma1aeeui6r61ccm',
      loginWith: {
        oauth: {
          domain: 'eu-north-11up1ejkzi.auth.eu-north-1.amazoncognito.com',
          scopes: ['email', 'openid', 'phone'],
          redirectSignIn: ['myapp://callback'],
          redirectSignOut: ['myapp://signout'],
          responseType: 'code',
        },
      },
    },
  },
  API: {
    REST: {
      BolBharatAPI: {
        endpoint: API_GATEWAY_URL,
        region: AWS_REGION,
      },
    },
  },
});
