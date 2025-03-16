// API Test Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('API test page loaded');
    
    // Create the test interface
    const testContainer = document.createElement('div');
    testContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        color: #0f0;
        padding: 20px;
        border-radius: 10px;
        font-family: monospace;
        z-index: 10000;
        width: 80%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        display: none;
        border: 1px solid #0f0;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    `;
    
    testContainer.innerHTML = `
        <h2 style="margin-top: 0; color: #0f0; text-align: center; border-bottom: 1px solid #0f0; padding-bottom: 10px;">API Test Console</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
            <button id="test-api-key" style="flex: 1; background: #000; color: #0f0; padding: 8px; border: 1px solid #0f0; cursor: pointer;">Test API Key</button>
            <button id="test-claude-api" style="flex: 1; background: #000; color: #0f0; padding: 8px; border: 1px solid #0f0; cursor: pointer;">Test Claude API</button>
            <button id="test-gemini-api" style="flex: 1; background: #000; color: #0f0; padding: 8px; border: 1px solid #0f0; cursor: pointer;">Test Gemini API</button>
            <button id="reset-api-key" style="flex: 1; background: #000; color: #f00; padding: 8px; border: 1px solid #f00; cursor: pointer;">Reset API Key</button>
            <button id="close-test" style="flex: 1; background: #000; color: #fff; padding: 8px; border: 1px solid #fff; cursor: pointer;">Close</button>
        </div>
        <div id="test-results" style="background: #000; color: #0f0; padding: 10px; border: 1px solid #0f0; height: 300px; overflow-y: auto; font-size: 14px; white-space: pre-wrap; word-break: break-word;"></div>
    `;
    
    document.body.appendChild(testContainer);
    
    // Create a button to show the test interface
    const testButton = document.createElement('button');
    testButton.textContent = 'API Test';
    testButton.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #0f0;
        padding: 5px 10px;
        font-family: monospace;
        z-index: 10000;
        border: 1px solid #0f0;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    document.body.appendChild(testButton);
    
    // Get elements
    const closeButton = document.getElementById('close-test');
    const testApiKeyButton = document.getElementById('test-api-key');
    const testClaudeApiButton = document.getElementById('test-claude-api');
    const testGeminiApiButton = document.getElementById('test-gemini-api');
    const resetApiKeyButton = document.getElementById('reset-api-key');
    const testResults = document.getElementById('test-results');
    
    // Function to write to the test results
    function writeToResults(text, isError = false) {
        const timestamp = new Date().toLocaleTimeString();
        const formattedText = `[${timestamp}] ${text}`;
        
        // Create new element for the log entry
        const logEntry = document.createElement('div');
        logEntry.textContent = formattedText;
        
        if (isError) {
            logEntry.style.color = '#f55'; // Red for errors
        }
        
        testResults.appendChild(logEntry);
        testResults.scrollTop = testResults.scrollHeight;
    }
    
    // Function to show the test interface
    function showTestInterface() {
        testContainer.style.display = 'block';
    }
    
    // Function to hide the test interface
    function hideTestInterface() {
        testContainer.style.display = 'none';
    }
    
    // Test API key function
    async function testApiKey() {
        writeToResults('Testing API key...');
        
        // Get API key from localStorage
        let apiKey = localStorage.getItem('openrouter_api_key');
        
        if (!apiKey) {
            writeToResults('API key not found in localStorage', true);
            return;
        }
        
        // Format API key - OpenRouter requires the Bearer prefix
        if (!apiKey.startsWith('Bearer ')) {
            apiKey = 'Bearer ' + apiKey;
        }
        
        writeToResults(`API key format (first chars): ${apiKey.substring(0, 10)}...`);
        
        try {
            // Test the API key with a simple request to OpenRouter's key validation endpoint
            const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
                method: 'GET',
                headers: {
                    'Authorization': apiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE'
                }
            });
            
            writeToResults(`Response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                writeToResults('API key is valid!');
                writeToResults(`Key details: ${JSON.stringify(data, null, 2)}`);
            } else {
                const errorText = await response.text();
                writeToResults(`API key validation failed: ${response.status}`, true);
                
                try {
                    const errorData = JSON.parse(errorText);
                    writeToResults(`Error details: ${JSON.stringify(errorData, null, 2)}`, true);
                } catch (e) {
                    writeToResults(`Error response: ${errorText}`, true);
                }
                
                if (response.status === 401) {
                    writeToResults(`Your API key appears to be invalid. Please reset it using the "Reset API Key" button.`, true);
                }
            }
        } catch (error) {
            writeToResults(`Error testing API key: ${error.message}`, true);
        }
    }
    
    // Test Claude API function
    async function testClaudeApi() {
        writeToResults('Testing Claude API...');
        
        // Get API key from localStorage
        let apiKey = localStorage.getItem('openrouter_api_key');
        
        if (!apiKey) {
            writeToResults('API key not found in localStorage', true);
            return;
        }
        
        // Format API key properly for OpenRouter
        if (!apiKey.startsWith('Bearer ')) {
            apiKey = 'Bearer ' + apiKey;
        }
        
        writeToResults(`Authorization header: ${apiKey.substring(0, 10)}...`);
        
        try {
            const testPrompt = "Hello, please respond with a short greeting. Keep it under 10 words.";
            
            writeToResults(`Sending test prompt to Claude: "${testPrompt}"`);
            
            // Make the API request
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE'
                },
                body: JSON.stringify({
                    model: 'anthropic/claude-3-opus:beta',
                    messages: [
                        { role: 'user', content: testPrompt }
                    ],
                    max_tokens: 100,
                    temperature: 0.5
                })
            });
            
            writeToResults(`Response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                writeToResults('Claude API test successful!');
                writeToResults(`Claude's response: "${data.choices[0].message.content}"`);
            } else {
                const errorText = await response.text();
                writeToResults(`Claude API test failed: ${response.status}`, true);
                
                try {
                    const errorData = JSON.parse(errorText);
                    writeToResults(`Error details: ${JSON.stringify(errorData, null, 2)}`, true);
                } catch (e) {
                    writeToResults(`Error response: ${errorText}`, true);
                }
                
                if (response.status === 401) {
                    writeToResults(`Authentication failed. Your API key may be invalid.`, true);
                    window.showApiKeyInterface();
                }
            }
        } catch (error) {
            writeToResults(`Error testing Claude API: ${error.message}`, true);
        }
    }
    
    // Test Gemini API function
    async function testGeminiApi() {
        writeToResults('Testing Gemini API...');
        
        // Get API key from localStorage
        let apiKey = localStorage.getItem('openrouter_api_key');
        
        if (!apiKey) {
            writeToResults('API key not found in localStorage', true);
            return;
        }
        
        // Format API key properly for OpenRouter
        if (!apiKey.startsWith('Bearer ')) {
            apiKey = 'Bearer ' + apiKey;
        }
        
        writeToResults(`Authorization header: ${apiKey.substring(0, 10)}...`);
        
        try {
            const testPrompt = "Hello, please respond with a short greeting. Keep it under 10 words.";
            
            writeToResults(`Sending test prompt to Gemini: "${testPrompt}"`);
            
            // Make the API request
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE'
                },
                body: JSON.stringify({
                    model: 'google/gemini-1.5-pro-latest',
                    messages: [
                        { role: 'user', content: testPrompt }
                    ],
                    max_tokens: 100,
                    temperature: 0.5
                })
            });
            
            writeToResults(`Response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                writeToResults('Gemini API test successful!');
                writeToResults(`Gemini's response: "${data.choices[0].message.content}"`);
            } else {
                const errorText = await response.text();
                writeToResults(`Gemini API test failed: ${response.status}`, true);
                
                try {
                    const errorData = JSON.parse(errorText);
                    writeToResults(`Error details: ${JSON.stringify(errorData, null, 2)}`, true);
                } catch (e) {
                    writeToResults(`Error response: ${errorText}`, true);
                }
                
                if (response.status === 401) {
                    writeToResults(`Authentication failed. Your API key may be invalid.`, true);
                    window.showApiKeyInterface();
                }
            }
        } catch (error) {
            writeToResults(`Error testing Gemini API: ${error.message}`, true);
        }
    }
    
    // Add event listeners
    testButton.addEventListener('click', showTestInterface);
    closeButton.addEventListener('click', hideTestInterface);
    testApiKeyButton.addEventListener('click', testApiKey);
    testClaudeApiButton.addEventListener('click', testClaudeApi);
    testGeminiApiButton.addEventListener('click', testGeminiApi);
    
    // Reset API key button
    resetApiKeyButton.addEventListener('click', function() {
        if (window.showApiKeyInterface) {
            window.showApiKeyInterface();
            hideTestInterface();
        } else {
            writeToResults('API key interface not available', true);
        }
    });
    
    // Check for test parameter in URL
    if (window.location.href.includes('?api-test=true')) {
        showTestInterface();
    }
}); 