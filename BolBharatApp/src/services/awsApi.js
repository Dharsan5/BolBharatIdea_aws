/**
 * AWS API Service
 * Handles all API calls to AWS API Gateway with proper authentication
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import Constants from 'expo-constants';

// Normalize base URL so endpoint concatenation is stable.
const normalizeBaseUrl = (url) => String(url || '').replace(/\/+$/, '');

const runtimeExtra =
  Constants.expoConfig?.extra ||
  Constants.manifest?.extra ||
  Constants.manifest2?.extra?.expoClient?.extra ||
  {};

// Get API base URL from runtime config or environment.
const API_BASE_URL = normalizeBaseUrl(
  process.env.EXPO_PUBLIC_API_GATEWAY_URL ||
  process.env.EXPO_PUBLIC_DB_LAMBDA_URL ||
  runtimeExtra.apiGatewayUrl ||
  runtimeExtra.dbLambdaUrl ||
  process.env.API_GATEWAY_URL ||
  process.env.DB_LAMBDA_URL ||
  'https://your-api-gateway-id.execute-api.ap-south-1.amazonaws.com/prod'
);

const AWS_REGION = 
  process.env.EXPO_PUBLIC_AWS_REGION ||
  runtimeExtra.awsRegion ||
  process.env.AWS_REGION ||
  'ap-south-1';

const isLambdaFunctionUrl = /\.lambda-url\./i.test(API_BASE_URL);

if (__DEV__) {
  const apiPreview = API_BASE_URL || '<empty>';
  console.log('[awsApi] baseUrl:', apiPreview, 'lambdaMode:', isLambdaFunctionUrl, 'region:', AWS_REGION);
}

const actionFromEndpoint = (endpoint, method = 'GET') => {
  if (method === 'POST' && endpoint === '/schemes/search') return 'searchSchemes';
  if (method === 'GET' && endpoint.startsWith('/schemes/')) return 'getSchemeDetails';
  if (method === 'POST' && endpoint === '/schemes/recommendations') return 'getSchemeRecommendations';
  if (method === 'POST' && endpoint.includes('/eligibility')) return 'checkSchemeEligibility';
  if (method === 'POST' && endpoint === '/forms/submit') return 'submitForm';
  if (method === 'GET' && endpoint.startsWith('/forms/applications')) return 'getApplications';
  if (method === 'GET' && endpoint.startsWith('/applications/') && endpoint.endsWith('/details')) return 'getApplicationDetails';
  if (method === 'GET' && endpoint.startsWith('/applications/')) return 'trackApplication';
  if (method === 'POST' && endpoint === '/documents/process') return 'processDocument';
  if (method === 'GET' && endpoint === '/documents/history') return 'getDocumentHistory';
  if (method === 'POST' && endpoint === '/documents/simplify') return 'simplifyDocument';
  if (method === 'GET' && endpoint.startsWith('/users/')) return 'getUser';
  if (method === 'PUT' && endpoint.startsWith('/users/')) return 'saveUser';
  if (method === 'POST' && endpoint === '/voice/transcribe') return 'transcribeAudio';
  if (method === 'POST' && endpoint === '/voice/synthesize') return 'synthesizeSpeech';
  return null;
};

const extractDataFromEndpoint = (endpoint, method = 'GET', body) => {
  if (body) {
    try {
      return JSON.parse(body);
    } catch (e) {
      return { rawBody: body };
    }
  }

  if (method === 'GET' && endpoint.startsWith('/schemes/')) {
    const schemeId = endpoint.split('/')[2];
    return { schemeId };
  }

  if (method === 'GET' && endpoint.startsWith('/forms/applications?')) {
    const query = endpoint.split('?')[1] || '';
    const params = new URLSearchParams(query);
    return { userId: params.get('userId') };
  }

  if (method === 'GET' && endpoint.startsWith('/applications/') && endpoint.endsWith('/details')) {
    return { applicationId: endpoint.split('/')[2] };
  }

  if (method === 'GET' && endpoint.startsWith('/applications/')) {
    return { applicationId: endpoint.split('/')[2] };
  }

  if ((method === 'GET' || method === 'PUT') && endpoint.startsWith('/users/')) {
    return { userId: endpoint.split('/')[2] };
  }

  return {};
};

/**
 * Get authentication headers with Cognito token
 */
async function getAuthHeaders() {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  } catch (error) {
    console.warn('No auth token available:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
}

/**
 * Make authenticated API call to AWS
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const headers = await getAuthHeaders();
    
    const requestOptions = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    // Compatibility mode for Lambda Function URLs that accept { action, data } payload.
    const method = (options.method || 'GET').toUpperCase();
    if (isLambdaFunctionUrl) {
      let action = actionFromEndpoint(endpoint, method);

      // Some deployed Lambda backends use different action names for schemes.
      const fallbackActions = endpoint === '/schemes/search'
        ? ['searchSchemes', 'getSchemes', 'fetchSchemes']
        : [action];

      if (!action) {
        fallbackActions.splice(0, fallbackActions.length, null);
      }

      const data = extractDataFromEndpoint(endpoint, method, options.body);

      for (const candidate of fallbackActions) {
        if (!candidate) {
          break;
        }

        requestOptions.method = 'POST';
        requestOptions.body = JSON.stringify({ action: candidate, data });

        const response = await fetch(API_BASE_URL, requestOptions);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const message = String(errorData.message || errorData.error || '');
          const isUnknownAction = /unknown action/i.test(message);

          if (isUnknownAction && endpoint === '/schemes/search') {
            continue;
          }

          throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
        }

        return await response.json();
      }

      throw new Error('Schemes search is not implemented in the current Lambda backend (unknown action).');
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `API Request Error [${endpoint}] (base=${API_BASE_URL}, lambdaMode=${isLambdaFunctionUrl}):`,
      error
    );
    throw error;
  }
}

/**
 * Schemes API
 */
export const schemesApi = {
  /**
   * Search for schemes based on query and filters
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {string} params.category - Category filter
   * @param {Object} params.filters - Additional filters
   * @param {Object} params.userProfile - User profile for personalization
   */
  async searchSchemes({ query = '', category = 'all', filters = {}, userProfile = {} }) {
    return apiRequest('/schemes/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        category,
        filters,
        userProfile,
      }),
    });
  },

  /**
   * Get detailed information about a specific scheme
   * @param {string} schemeId - Scheme ID
   */
  async getSchemeDetails(schemeId) {
    return apiRequest(`/schemes/${schemeId}`, {
      method: 'GET',
    });
  },

  /**
   * Get personalized scheme recommendations
   * @param {Object} userProfile - User profile data
   */
  async getRecommendations(userProfile) {
    return apiRequest('/schemes/recommendations', {
      method: 'POST',
      body: JSON.stringify({ userProfile }),
    });
  },

  /**
   * Check eligibility for a scheme
   * @param {string} schemeId - Scheme ID
   * @param {Object} userProfile - User profile data
   */
  async checkEligibility(schemeId, userProfile) {
    return apiRequest(`/schemes/${schemeId}/eligibility`, {
      method: 'POST',
      body: JSON.stringify({ userProfile }),
    });
  },
};

/**
 * Forms API
 */
export const formsApi = {
  /**
   * Submit a form application
   * @param {Object} formData - Form data
   */
  async submitForm(formData) {
    return apiRequest('/forms/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  /**
   * Get list of applications
   * @param {string} userId - User ID
   */
  async getApplications(userId) {
    return apiRequest(`/forms/applications?userId=${userId}`, {
      method: 'GET',
    });
  },

  /**
   * Get application details
   * @param {string} applicationId - Application ID
   */
  async getApplicationDetails(applicationId) {
    return apiRequest(`/applications/${applicationId}/details`, {
      method: 'GET',
    });
  },

  /**
   * Track application status
   * @param {string} applicationId - Application ID
   */
  async trackApplication(applicationId) {
    return apiRequest(`/applications/${applicationId}`, {
      method: 'GET',
    });
  },
};

/**
 * Documents API
 */
export const documentsApi = {
  /**
   * Process a document with OCR
   * @param {Object} params - Document parameters
   * @param {string} params.imageUri - Image URI
   * @param {string} params.documentType - Document type
   */
  async processDocument({ imageUri, documentType }) {
    // Convert image to base64 or presigned URL
    return apiRequest('/documents/process', {
      method: 'POST',
      body: JSON.stringify({ imageUri, documentType }),
    });
  },

  /**
   * Get document processing history
   */
  async getDocumentHistory() {
    return apiRequest('/documents/history', {
      method: 'GET',
    });
  },

  /**
   * Simplify document text
   * @param {Object} params - Simplification parameters
   * @param {string} params.text - Original text
   * @param {string} params.language - Target language
   */
  async simplifyDocument({ text, language }) {
    return apiRequest('/documents/simplify', {
      method: 'POST',
      body: JSON.stringify({ text, language }),
    });
  },
};

/**
 * User API
 */
export const userApi = {
  /**
   * Get user profile
   * @param {string} userId - User ID
   */
  async getUserProfile(userId) {
    return apiRequest(`/users/${userId}`, {
      method: 'GET',
    });
  },

  /**
   * Update user profile
   * @param {Object} userData - User data
   */
  async updateUserProfile(userData) {
    return apiRequest(`/users/${userData.id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

/**
 * Voice API
 */
export const voiceApi = {
  /**
   * Transcribe audio to text
   * @param {Object} params - Transcription parameters
   * @param {string} params.audioUri - Audio file URI
   * @param {string} params.language - Language code
   */
  async transcribeAudio({ audioUri, language }) {
    return apiRequest('/voice/transcribe', {
      method: 'POST',
      body: JSON.stringify({ audioUri, language }),
    });
  },

  /**
   * Synthesize text to speech
   * @param {Object} params - Synthesis parameters
   * @param {string} params.text - Text to synthesize
   * @param {string} params.language - Language code
   */
  async synthesizeSpeech({ text, language }) {
    return apiRequest('/voice/synthesize', {
      method: 'POST',
      body: JSON.stringify({ text, language }),
    });
  },
};

// Export base URL for direct access if needed
export const API_URL = API_BASE_URL;
export const AWS_CONFIG = {
  region: AWS_REGION,
  apiUrl: API_BASE_URL,
};

export default {
  schemes: schemesApi,
  forms: formsApi,
  documents: documentsApi,
  user: userApi,
  voice: voiceApi,
};
