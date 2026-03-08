/**
 * Test Script for AWS API Integration
 * Run this script to test the API connections before deploying
 * 
 * Usage: node test-aws-api.js
 */

const API_BASE_URL = 'https://your-api-gateway-id.execute-api.ap-south-1.amazonaws.com/prod';

// Mock authentication token (replace with actual Cognito token)
const AUTH_TOKEN = 'your-cognito-id-token';

/**
 * Test scheme search endpoint
 */
async function testSchemeSearch() {
  console.log('\n=== Testing Scheme Search ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/schemes/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        query: 'farming',
        category: 'Agriculture',
        filters: {},
        userProfile: {
          occupation: 'Farmer',
          location: 'Rural',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✓ Success!');
    console.log(`Found ${data.schemes?.length || 0} schemes`);
    
    if (data.schemes && data.schemes.length > 0) {
      console.log('\nTop 3 schemes:');
      data.schemes.slice(0, 3).forEach((scheme, i) => {
        console.log(`${i + 1}. ${scheme.name} (${scheme.category})`);
        console.log(`   Relevance: ${scheme.relevanceScore || 'N/A'}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

/**
 * Test scheme details endpoint
 */
async function testSchemeDetails() {
  console.log('\n=== Testing Scheme Details ===');
  
  try {
    const schemeId = 'PM_KISAN_001';
    const response = await fetch(`${API_BASE_URL}/schemes/${schemeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✓ Success!');
    console.log(`Scheme: ${data.name}`);
    console.log(`Category: ${data.category}`);
    console.log(`Benefits: ${data.benefits}`);
    
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

/**
 * Test health check endpoint (if available)
 */
async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✓ API is healthy');
    console.log('Status:', data.status || 'OK');
    
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

/**
 * Test CORS configuration
 */
async function testCORS() {
  console.log('\n=== Testing CORS ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/schemes/search`, {
      method: 'OPTIONS',
    });

    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
    };

    console.log('✓ CORS Headers:', corsHeaders);
    
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('========================================');
  console.log('  BolBharat AWS API Integration Tests  ');
  console.log('========================================');
  console.log(`API URL: ${API_BASE_URL}`);
  
  if (API_BASE_URL.includes('your-api-gateway-id')) {
    console.log('\n⚠️  Warning: Please update API_BASE_URL with your actual API Gateway URL');
    console.log('Update line 8 in this file with your endpoint.\n');
  }

  if (AUTH_TOKEN === 'your-cognito-id-token') {
    console.log('\n⚠️  Warning: Using mock authentication token');
    console.log('For authenticated endpoints, update AUTH_TOKEN with a real Cognito token.\n');
  }

  const results = {
    healthCheck: await testHealthCheck(),
    cors: await testCORS(),
    schemeSearch: await testSchemeSearch(),
    schemeDetails: await testSchemeDetails(),
  };

  console.log('\n========================================');
  console.log('  Test Results Summary  ');
  console.log('========================================');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} - ${test}`);
  });

  const allPassed = Object.values(results).every(r => r);
  console.log('\n' + (allPassed ? '✓ All tests passed!' : '✗ Some tests failed'));
  console.log('========================================\n');

  process.exit(allPassed ? 0 : 1);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  testSchemeSearch,
  testSchemeDetails,
  testHealthCheck,
  testCORS,
};
