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
    
    // Hardcoded API key for testing
    const apiKey = "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";
    
    console.log("Using direct API key for testing");
    
    // Make the request to OpenRouter
    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://alienai.netlify.app',
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