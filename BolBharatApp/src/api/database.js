const DB_LAMBDA_URL = 'https://lywm2lazwiz37swnhhshrc6cuu0hatmy.lambda-url.eu-north-1.on.aws/';

const dbCall = async (action, data) => {
  try {
    const res = await fetch(DB_LAMBDA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data }),
    });
    return await res.json();
  } catch (err) {
    console.error('DB error:', err);
    return { success: false, error: err.message };
  }
};

export const saveUser = (userData) => dbCall('saveUser', userData);
export const getUser = (userId) => dbCall('getUser', { userId });
export const saveConversation = (userId, question, aiResponse, language) =>
  dbCall('saveConversation', { userId, question, aiResponse, language });
export const getConversations = (userId) => dbCall('getConversations', { userId });
export const saveApplication = (userId, applicationData) =>
  dbCall('saveApplication', { userId, ...applicationData });
export const getApplications = (userId) => dbCall('getApplications', { userId });