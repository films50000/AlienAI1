const axios = require('axios');

// This function will be our proxy to OpenRouter for query relevance checks
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
    const requestData = JSON.parse(event.body);
    const { query, knowledgeTopics } = requestData;
    
    // Your OpenRouter API key - this will be stored as an environment variable in Netlify
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
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

    // Make the request to OpenRouter
    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'ALIEN CODE INTERFACE BY ALI FROM XENO-7'
      },
      data: {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 150
      }
    });
    
    // Process the response
    const aiResponse = response.data.choices[0].message.content.trim();
    try {
      // Extract the JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : '{}';
      const result = JSON.parse(jsonStr);
      
      // Return the processed result
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    } catch (e) {
      console.error('Error parsing AI response:', e, aiResponse);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          isRelevant: false, 
          certainty: 0, 
          explanation: 'Failed to parse AI response' 
        })
      };
    }
  } catch (error) {
    // Handle errors
    console.error('Error determining query relevance:', error.message);
    
    // Return a formatted error response
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        isRelevant: false,
        certainty: 0,
        explanation: 'Error in API call: ' + (error.response?.data?.error?.message || error.message)
      })
    };
  }
}; 