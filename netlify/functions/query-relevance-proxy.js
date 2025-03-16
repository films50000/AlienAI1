const axios = require('axios');

// This function will be our proxy to OpenRouter for query relevance checks
exports.handler = async function(event, context) {
  // Set up CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Log the request method and path
  console.log(`Request: ${event.httpMethod} ${event.path}`);
  
  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return {
      statusCode: 204,
      headers
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    console.error(`Method not allowed: ${event.httpMethod}`);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError.message);
      console.log('Raw body received:', event.body);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    const { query, knowledgeTopics } = requestData;
    
    if (!query || !knowledgeTopics) {
      console.error('Missing required parameters:', { query: !!query, knowledgeTopics: !!knowledgeTopics });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters: query and knowledgeTopics are required' })
      };
    }
    
    console.log(`Processing query relevance check for: "${query}"`);
    console.log(`Knowledge topics: ${JSON.stringify(knowledgeTopics)}`);
    
    // Your OpenRouter API key - this will be stored as an environment variable in Netlify
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('API key not configured in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }
    
    // Create the prompt for query relevance assessment
    const prompt = `You are a topic-matching assistant for a knowledge base system.
            
Knowledge Base Topics: ${knowledgeTopics.join(', ')}

User Query: "${query}"

Is this query specifically asking about any of the knowledge base topics listed above? 
Consider that general programming questions about C++ that don't specifically relate to our knowledge base topics should be answered using general knowledge.

Reply with a JSON object only:
{
  "isRelevant": true/false,
  "certainty": 0-100 (percentage of certainty),
  "matchedTopic": "topic name from the list or null if none",
  "explanation": "brief explanation of why this is or isn't relevant to our knowledge base"
}`;

    console.log('Sending request to OpenRouter...');
    
    // Make the request to OpenRouter
    try {
      const response = await axios({
        method: 'post',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aliensai.netlify.app/',
          'X-Title': 'ALIEN CODE INTERFACE BY ALI FROM XENO-7'
        },
        data: {
          model: "openai/gpt-3.5-turbo", // Using a reliable model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 150
        },
        timeout: 15000 // 15 second timeout
      });
      
      console.log(`OpenRouter response status: ${response.status}`);
      
      // Process the response
      const aiResponse = response.data.choices[0].message.content.trim();
      try {
        // Extract the JSON from the response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : '{}';
        const result = JSON.parse(jsonStr);
        
        console.log(`Processed result: ${JSON.stringify(result)}`);
        
        // Return the processed result
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };
      } catch (e) {
        console.error('Error parsing AI response:', e);
        console.log('Raw AI response:', aiResponse);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            isRelevant: false, 
            certainty: 0, 
            explanation: 'Failed to parse AI response' 
          })
        };
      }
    } catch (openRouterError) {
      console.error('OpenRouter API error:', openRouterError.message);
      
      // Log specific details about the error response if available
      if (openRouterError.response) {
        console.error('OpenRouter API status:', openRouterError.response.status);
        console.error('OpenRouter API error details:', openRouterError.response.data);
      }
      
      return {
        statusCode: openRouterError.response?.status || 500,
        headers,
        body: JSON.stringify({
          isRelevant: false,
          certainty: 0,
          explanation: 'OpenRouter API error: ' + (openRouterError.response?.data?.error?.message || openRouterError.message)
        })
      };
    }
  } catch (error) {
    // Detailed error logging
    console.error('Unexpected error in query relevance function:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Return a formatted error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        isRelevant: false,
        certainty: 0,
        explanation: 'Unexpected server error: ' + error.message
      })
    };
  }
}; 