import { Amplify } from 'aws-amplify';

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
});
