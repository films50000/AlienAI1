const axios = require('axios');

// This function will be our proxy to OpenRouter
exports.handler = async function(event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    
    // Your OpenRouter API key - this will be stored as an environment variable in Netlify
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }
    
    // Make the request to OpenRouter
    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'ALIEN CODE INTERFACE BY ALI FROM XENO-7'
      },
      data: requestBody
    });
    
    // Return the response from OpenRouter
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    // Handle errors
    console.error('Error calling OpenRouter:', error.message);
    
    // Return a formatted error response
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: {
          message: error.response?.data?.error?.message || error.message,
          type: error.response?.data?.error?.type || 'ServerError',
          code: error.response?.status || 500
        }
      })
    };
  }
}; 