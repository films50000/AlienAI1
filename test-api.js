// Simple script to test the OpenRouter API key
const axios = require('axios');

async function testApi() {
  const apiKey = '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';
  
  console.log('Testing OpenRouter API key...');
  
  try {
    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://alienai.netlify.app',
        'X-Title': 'ALIEN CODE INTERFACE TEST'
      },
      data: {
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Say hello world!'
          }
        ],
        max_tokens: 100
      }
    });
    
    console.log('API test successful!');
    console.log('Response:', response.data.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('API test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return false;
  }
}

// Run the test
testApi().then(success => {
  console.log(success ? 'API key is working!' : 'API key is not working!');
}); 