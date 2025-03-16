// API Key Manager for OpenRouter integration
document.addEventListener('DOMContentLoaded', function() {
    // Create API key management interface
    const apiKeyInterface = document.createElement('div');
    apiKeyInterface.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: #0f0;
        padding: 15px;
        font-family: monospace;
        z-index: 10001;
        width: 400px;
        border: 1px solid #0f0;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        display: none;
    `;
    
    apiKeyInterface.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #0f0;">OpenRouter API Key Management</h3>
        <p style="margin: 0 0 10px 0; font-size: 12px;">
            Your API key appears to be invalid. Please enter a valid OpenRouter API key below.
            You can get a free key at <a href="https://openrouter.ai/keys" target="_blank" style="color: #0ff;">openrouter.ai/keys</a>
        </p>
        <input type="text" id="new-api-key" placeholder="Enter your OpenRouter API key" style="width: 100%; padding: 5px; background: #000; color: #0f0; border: 1px solid #0f0; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between;">
            <button id="save-api-key" style="background: #000; color: #0f0; border: 1px solid #0f0; padding: 5px; cursor: pointer;">Save API Key</button>
            <button id="cancel-api-key" style="background: #000; color: #f00; border: 1px solid #f00; padding: 5px; cursor: pointer;">Cancel</button>
        </div>
        <div id="api-key-status" style="margin-top: 10px; font-size: 12px;"></div>
    `;
    
    document.body.appendChild(apiKeyInterface);
    
    // Get elements
    const newApiKeyInput = document.getElementById('new-api-key');
    const saveApiKeyButton = document.getElementById('save-api-key');
    const cancelApiKeyButton = document.getElementById('cancel-api-key');
    const apiKeyStatusEl = document.getElementById('api-key-status');
    
    // Get the current API key
    const currentApiKey = localStorage.getItem('openrouter_api_key');
    if (currentApiKey) {
        // Display only the first few characters for security
        const maskedKey = currentApiKey.substring(0, 10) + '...' + currentApiKey.substring(currentApiKey.length - 4);
        newApiKeyInput.value = '';
        newApiKeyInput.placeholder = 'Current key: ' + maskedKey;
    }
    
    // Function to show the API key interface
    window.showApiKeyInterface = function() {
        apiKeyInterface.style.display = 'block';
        
        // Add status message
        apiKeyStatusEl.textContent = 'API key authentication failed. Please enter a valid OpenRouter API key.';
        apiKeyStatusEl.style.color = '#f00';
    };
    
    // Function to hide the API key interface
    function hideApiKeyInterface() {
        apiKeyInterface.style.display = 'none';
    }
    
    // Function to clean and validate an API key
    function cleanApiKey(key) {
        // Remove any whitespace
        key = key.trim();
        
        // Remove 'Bearer ' prefix if present
        if (key.startsWith('Bearer ')) {
            key = key.substring(7).trim();
        }
        
        // Validate the key format (basic check)
        if (key.startsWith('sk-or-') && key.length > 20) {
            return key;
        } else {
            console.warn('API key appears to be in an invalid format:', key.substring(0, 10) + '...');
            return key; // Return anyway but log a warning
        }
    }
    
    // Function to save the API key
    async function saveApiKey() {
        const rawApiKey = newApiKeyInput.value.trim();
        
        if (!rawApiKey) {
            apiKeyStatusEl.textContent = 'Please enter a valid API key';
            apiKeyStatusEl.style.color = '#f00';
            return;
        }
        
        // Clean and validate the API key
        const apiKey = cleanApiKey(rawApiKey);
        console.log('Cleaned API key (first few chars):', apiKey.substring(0, 10) + '...');
        
        apiKeyStatusEl.textContent = 'Testing API key...';
        apiKeyStatusEl.style.color = '#0f0';
        
        try {
            // Format the API key with Bearer prefix for testing
            let formattedApiKey = 'Bearer ' + apiKey;
            console.log('Testing with formatted key (first chars):', formattedApiKey.substring(0, 20) + '...');
            
            // Test the API key with a simple request
            const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
                method: 'GET',
                headers: {
                    'Authorization': formattedApiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE'
                }
            });
            
            console.log('API key validation response status:', response.status);
            
            if (response.ok) {
                // Store just the raw API key (without Bearer prefix)
                localStorage.setItem('openrouter_api_key', apiKey);
                console.log('API key saved to localStorage (first chars):', apiKey.substring(0, 10) + '...');
                
                apiKeyStatusEl.textContent = 'API key saved successfully! Reloading page...';
                apiKeyStatusEl.style.color = '#0f0';
                
                // Reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const data = await response.text();
                let errorMessage = 'API key validation failed';
                
                try {
                    const errorData = JSON.parse(data);
                    if (errorData.error && errorData.error.message) {
                        errorMessage = errorData.error.message;
                    }
                } catch (e) {
                    // If JSON parsing fails, use the response text
                    errorMessage = data || 'Unknown error';
                }
                
                console.error('API key validation error:', errorMessage);
                apiKeyStatusEl.textContent = `Error: ${errorMessage}`;
                apiKeyStatusEl.style.color = '#f00';
            }
        } catch (error) {
            console.error('Error testing API key:', error);
            apiKeyStatusEl.textContent = `Error: ${error.message}`;
            apiKeyStatusEl.style.color = '#f00';
        }
    }
    
    // Add event listeners
    saveApiKeyButton.addEventListener('click', saveApiKey);
    cancelApiKeyButton.addEventListener('click', hideApiKeyInterface);
    
    // Check if the API key is valid
    if (window.location.href.includes('?reset-api-key=true')) {
        showApiKeyInterface();
    }
    
    // Create a button to open the API key interface
    const apiKeyButton = document.createElement('button');
    apiKeyButton.textContent = 'API Key';
    apiKeyButton.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #0f0;
        padding: 5px 10px;
        font-family: monospace;
        z-index: 10000;
        border: 1px solid #0f0;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    apiKeyButton.addEventListener('click', showApiKeyInterface);
    document.body.appendChild(apiKeyButton);
    
    // Add direct test function to window for console testing
    window.testApiKeyFormatting = function() {
        const storedKey = localStorage.getItem('openrouter_api_key');
        console.log('Raw stored key:', storedKey);
        
        let formatted = storedKey;
        if (!formatted.startsWith('Bearer ')) {
            formatted = 'Bearer ' + formatted;
        }
        
        console.log('Formatted for API use:', formatted);
    };
    
    // Add API Key check function to window for other scripts to use
    window.checkApiKey = async function() {
        const apiKey = localStorage.getItem('openrouter_api_key');
        
        if (!apiKey) {
            console.error('API key not found');
            showApiKeyInterface();
            return false;
        }
        
        try {
            // Format API key with Bearer prefix for validation
            let formattedApiKey = 'Bearer ' + apiKey;
            console.log('Checking API key (first chars):', formattedApiKey.substring(0, 20) + '...');
            
            // Test if the key is valid (just a GET request to check, no tokens used)
            const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
                method: 'GET',
                headers: {
                    'Authorization': formattedApiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE'
                }
            });
            
            if (!response.ok) {
                console.error('API key validation failed', response.status);
                showApiKeyInterface();
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error checking API key:', error);
            showApiKeyInterface();
            return false;
        }
    };
    
    // Function to format API key for proper authentication
    window.formatApiKey = function(apiKey) {
        if (!apiKey) return null;
        
        // Clean the API key first
        apiKey = cleanApiKey(apiKey);
        
        // Always return with Bearer prefix
        return 'Bearer ' + apiKey;
    };
}); 