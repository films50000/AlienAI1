// API Test script to diagnose problems with the OpenRouter connection
document.addEventListener('DOMContentLoaded', function() {
    // Create test interface
    const testInterface = document.createElement('div');
    testInterface.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #0f0;
        padding: 10px;
        font-family: monospace;
        z-index: 10000;
        max-width: 400px;
        border: 1px solid #0f0;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    `;
    testInterface.innerHTML = `
        <h3 style="margin: 0; color: #0f0;">API Connection Test</h3>
        <div id="api-status">Status: Initializing...</div>
        <button id="run-test" style="background: #000; color: #0f0; border: 1px solid #0f0; padding: 5px; margin-top: 5px; cursor: pointer;">Test Claude</button>
        <button id="run-test-gemini" style="background: #000; color: #0f0; border: 1px solid #0f0; padding: 5px; margin-top: 5px; margin-left: 5px; cursor: pointer;">Test Gemini</button>
        <button id="reset-api-key" style="background: #000; color: #f00; border: 1px solid #f00; padding: 5px; margin-top: 5px; margin-left: 5px; cursor: pointer;">Reset API Key</button>
        <div id="test-results" style="margin-top: 10px; max-height: 200px; overflow-y: auto;"></div>
    `;
    document.body.appendChild(testInterface);
    
    // Get elements
    const statusEl = document.getElementById('api-status');
    const resultsEl = document.getElementById('test-results');
    const testButton = document.getElementById('run-test');
    const testGeminiButton = document.getElementById('run-test-gemini');
    const resetApiKeyButton = document.getElementById('reset-api-key');
    
    // Add log function
    function log(message, isError = false) {
        const logEntry = document.createElement('div');
        logEntry.style.color = isError ? '#f00' : '#0f0';
        logEntry.textContent = message;
        resultsEl.appendChild(logEntry);
        resultsEl.scrollTop = resultsEl.scrollHeight;
        console.log(message);
    }
    
    // Function to handle API key reset
    function resetApiKey() {
        if (window.showApiKeyInterface) {
            window.showApiKeyInterface();
        } else {
            log('API key interface not available', true);
        }
    }
    
    // Test API key with Claude
    async function testApiKey() {
        statusEl.textContent = 'Status: Testing API connection with Claude...';
        resultsEl.innerHTML = '';
        
        try {
            // Get the API key
            let apiKey = localStorage.getItem('openrouter_api_key');
            log(`API Key (first few chars): ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND'}`);
            
            if (!apiKey) {
                throw new Error('API key not found in localStorage');
            }
            
            // Make sure the API key is properly formatted WITH "Bearer " prefix for OpenRouter
            if (!apiKey.startsWith('Bearer ')) {
                apiKey = 'Bearer ' + apiKey;
            }
            
            // Try to make a simple request to OpenRouter
            log('Testing connection to OpenRouter with Claude model...');
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE' // Simplified title
                },
                body: JSON.stringify({
                    model: 'anthropic/claude-3-haiku',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant.'
                        },
                        {
                            role: 'user',
                            content: 'Hello, this is a test message to check if the API connection is working. Please respond with a simple confirmation.'
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });
            
            log(`Response status: ${response.status}`);
            
            if (response.status === 401) {
                const errorText = await response.text();
                log(`Authentication error: ${errorText}`, true);
                
                // Show API key interface
                if (window.showApiKeyInterface) {
                    window.showApiKeyInterface();
                }
                
                throw new Error('API key authentication failed. Please check your OpenRouter API key.');
            }
            
            const data = await response.text();
            log('Response received');
            
            try {
                const jsonData = JSON.parse(data);
                if (jsonData.error) {
                    throw new Error(jsonData.error.message || 'Unknown API error');
                }
                
                // Check if we got a proper response
                if (jsonData.choices && jsonData.choices[0] && jsonData.choices[0].message) {
                    const content = jsonData.choices[0].message.content;
                    log(`Success! Model response: "${content.substring(0, 50)}..."`);
                    statusEl.textContent = 'Status: API connection successful';
                    statusEl.style.color = '#0f0';
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (jsonError) {
                log(`Error parsing response: ${jsonError.message}`, true);
                log(`Raw response: ${data.substring(0, 300)}...`, true);
                throw new Error('Failed to parse API response');
            }
        } catch (error) {
            log(`Error: ${error.message}`, true);
            statusEl.textContent = `Status: Error - ${error.message}`;
            statusEl.style.color = '#f00';
        }
    }
    
    // Test API key with Gemini
    async function testGeminiApi() {
        statusEl.textContent = 'Status: Testing API connection with Gemini...';
        resultsEl.innerHTML = '';
        
        try {
            // Get the API key
            let apiKey = localStorage.getItem('openrouter_api_key');
            log(`API Key (first few chars): ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND'}`);
            
            if (!apiKey) {
                throw new Error('API key not found in localStorage');
            }
            
            // Make sure the API key is properly formatted WITH "Bearer " prefix for OpenRouter
            if (!apiKey.startsWith('Bearer ')) {
                apiKey = 'Bearer ' + apiKey;
            }
            
            // Try to make a simple request to OpenRouter
            log('Testing connection to OpenRouter with Gemini model...');
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE' // Simplified title
                },
                body: JSON.stringify({
                    model: 'google/gemini-1.5-pro-latest', // Updated to Gemini 1.5 which is more widely available
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant.'
                        },
                        {
                            role: 'user',
                            content: 'Hello, this is a test message to check if the API connection is working. Please respond with a simple confirmation.'
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });
            
            log(`Response status: ${response.status}`);
            
            if (response.status === 401) {
                const errorText = await response.text();
                log(`Authentication error: ${errorText}`, true);
                
                // Show API key interface
                if (window.showApiKeyInterface) {
                    window.showApiKeyInterface();
                }
                
                throw new Error('API key authentication failed. Please check your OpenRouter API key.');
            }
            
            const data = await response.text();
            log('Response received');
            
            try {
                const jsonData = JSON.parse(data);
                if (jsonData.error) {
                    throw new Error(jsonData.error.message || 'Unknown API error');
                }
                
                // Check if we got a proper response
                if (jsonData.choices && jsonData.choices[0] && jsonData.choices[0].message) {
                    const content = jsonData.choices[0].message.content;
                    log(`Success! Gemini response: "${content.substring(0, 50)}..."`);
                    statusEl.textContent = 'Status: Gemini API connection successful';
                    statusEl.style.color = '#0f0';
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (jsonError) {
                log(`Error parsing response: ${jsonError.message}`, true);
                log(`Raw response: ${data.substring(0, 300)}...`, true);
                throw new Error('Failed to parse API response');
            }
        } catch (error) {
            log(`Error: ${error.message}`, true);
            statusEl.textContent = `Status: Error - ${error.message}`;
            statusEl.style.color = '#f00';
        }
    }
    
    // Add button event listeners
    testButton.addEventListener('click', testApiKey);
    testGeminiButton.addEventListener('click', testGeminiApi);
    resetApiKeyButton.addEventListener('click', resetApiKey);
    
    // Run test automatically after a short delay
    setTimeout(testApiKey, 1000);
}); 