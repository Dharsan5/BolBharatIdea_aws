/**
 * AWS Lambda Function - Schemes Search
 * Endpoint: POST /schemes/search
 * 
 * This Lambda function searches for government schemes based on user query,
 * category, and filters. It uses AWS Bedrock for AI-powered matching.
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// Initialize AWS clients
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

const SCHEMES_TABLE = process.env.SCHEMES_TABLE || 'BolBharat-Schemes';

/**
 * Lambda handler function
 */
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { query = '', category = 'all', filters = {}, userProfile = {} } = body;

    // Fetch schemes from DynamoDB
    let schemes = await fetchSchemesFromDB(category);

    // If query is provided, use Bedrock for semantic search
    if (query && query.trim().length > 0) {
      schemes = await semanticSearchWithBedrock(schemes, query, userProfile);
    }

    // Apply additional filters
    schemes = applyFilters(schemes, filters);

    // Sort by relevance score
    schemes.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        schemes: schemes,
        total: schemes.length,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};

/**
 * Fetch schemes from DynamoDB
 */
async function fetchSchemesFromDB(category) {
  const params = {
    TableName: SCHEMES_TABLE,
  };

  if (category && category !== 'all') {
    params.FilterExpression = 'category = :category';
    params.ExpressionAttributeValues = {
      ':category': category,
    };
  }

  const command = new ScanCommand(params);
  const result = await docClient.send(command);
  
  return result.Items || [];
}

/**
 * Use AWS Bedrock for semantic search and ranking
 */
async function semanticSearchWithBedrock(schemes, query, userProfile) {
  try {
    // Prepare prompt for Claude 3 Sonnet
    const prompt = `You are an AI assistant helping match Indian government schemes to user needs.

User Query: "${query}"
User Profile: ${JSON.stringify(userProfile)}

Available Schemes:
${schemes.map((s, i) => `${i + 1}. ${s.name} (${s.category}): ${s.description}`).join('\n')}

Task: For each scheme, provide:
1. Relevance score (0-100)
2. Match reason in English and Hindi
3. Whether user is likely eligible

Return JSON format:
{
  "matches": [
    {
      "schemeId": "scheme_id",
      "relevanceScore": 95,
      "matchReason": "High match because...",
      "matchReasonHindi": "उच्च मिलान क्योंकि...",
      "likelyEligible": true
    }
  ]
}`;

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      body: JSON.stringify(payload),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Parse Bedrock response
    const aiResponse = JSON.parse(responseBody.content[0].text);
    
    // Merge AI insights with scheme data
    const enrichedSchemes = schemes.map(scheme => {
      const match = aiResponse.matches.find(m => m.schemeId === scheme.id);
      return {
        ...scheme,
        relevanceScore: match?.relevanceScore || 0,
        matchReason: match?.matchReason || 'General match',
        matchReasonHindi: match?.matchReasonHindi || 'सामान्य मिलान',
        likelyEligible: match?.likelyEligible || false,
      };
    });

    return enrichedSchemes;
  } catch (error) {
    console.error('Bedrock error:', error);
    // Fallback to simple keyword matching
    return schemes.map(scheme => ({
      ...scheme,
      relevanceScore: calculateSimpleRelevance(scheme, query),
    }));
  }
}

/**
 * Simple keyword-based relevance calculation (fallback)
 */
function calculateSimpleRelevance(scheme, query) {
  const queryLower = query.toLowerCase();
  const schemeName = scheme.name.toLowerCase();
  const schemeDesc = scheme.description.toLowerCase();
  
  let score = 0;
  
  if (schemeName.includes(queryLower)) score += 50;
  if (schemeDesc.includes(queryLower)) score += 30;
  if (scheme.category.toLowerCase().includes(queryLower)) score += 20;
  
  return Math.min(score, 100);
}

/**
 * Apply additional filters
 */
function applyFilters(schemes, filters) {
  let filtered = [...schemes];

  // Filter by benefits amount
  if (filters.minBenefit) {
    filtered = filtered.filter(s => {
      const amount = extractAmount(s.benefits);
      return amount >= filters.minBenefit;
    });
  }

  // Filter by deadline
  if (filters.hasDeadline !== undefined) {
    filtered = filtered.filter(s => {
      const hasDeadline = s.applicationDeadline && s.applicationDeadline !== 'Always Open';
      return filters.hasDeadline ? hasDeadline : !hasDeadline;
    });
  }

  return filtered;
}

/**
 * Extract numeric amount from benefit string
 */
function extractAmount(benefitString) {
  const match = benefitString.match(/₹?([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''));
  }
  return 0;
}
