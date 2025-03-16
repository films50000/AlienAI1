const fetch = require('node-fetch');

// Netlify function to proxy requests to OpenRouter
exports.handler = async function(event, context) {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow any origin - restrict this in production
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    
    // Get the API key from environment variables
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    console.log('Function triggered. API key exists:', !!API_KEY);

    // Check if API key is configured
    if (!API_KEY) {
      console.error('OpenRouter API key is not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'OpenRouter API key is not configured'
        })
      };
    }

    // Make request to OpenRouter API
    console.log('Making request to OpenRouter API');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://aliensai.netlify.app/',
        'X-Title': 'Alien AI'
      },
      body: JSON.stringify(requestBody)
    });

    // Get response data
    const data = await response.json();
    
    console.log('Received response from OpenRouter API:', 
                response.status, 
                Object.keys(data).join(', '));

    // Return the response from OpenRouter
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error in OpenRouter proxy:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}; 