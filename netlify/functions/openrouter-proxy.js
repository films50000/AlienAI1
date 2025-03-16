const fetch = require('node-fetch');

// Netlify function to proxy requests to OpenRouter
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Allow': 'POST'
      }
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    
    // Get the API key from environment variables
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    // Check if API key is configured
    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'OpenRouter API key is not configured'
        })
      };
    }

    // Make request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://alien-ai.netlify.app/' // Replace with your site's URL
      },
      body: JSON.stringify(requestBody)
    });

    // Get response data
    const data = await response.json();

    // Return the response from OpenRouter
    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message
      })
    };
  }
}; 