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
        newApiKeyInput.value = currentApiKey;
    }
    
    // Function to show the API key interface
    window.showApiKeyInterface = function() {
        apiKeyInterface.style.display = 'block';
    };
    
    // Function to hide the API key interface
    function hideApiKeyInterface() {
        apiKeyInterface.style.display = 'none';
    }
    
    // Function to save the API key
    async function saveApiKey() {
        const apiKey = newApiKeyInput.value.trim();
        
        if (!apiKey) {
            apiKeyStatusEl.textContent = 'Please enter a valid API key';
            apiKeyStatusEl.style.color = '#f00';
            return;
        }
        
        apiKeyStatusEl.textContent = 'Testing API key...';
        apiKeyStatusEl.style.color = '#0f0';
        
        try {
            // Format the API key with Bearer prefix for testing
            let formattedApiKey = apiKey;
            if (!formattedApiKey.startsWith('Bearer ')) {
                formattedApiKey = 'Bearer ' + formattedApiKey;
            }
            
            // Test the API key with a simple request
            const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
                method: 'GET',
                headers: {
                    'Authorization': formattedApiKey,
                    'HTTP-Referer': 'https://aliensai.netlify.app/',
                    'X-Title': 'ALIEN CODE INTERFACE'
                }
            });
            
            if (response.ok) {
                // Save the API key to localStorage without the Bearer prefix (our code adds it)
                let storageApiKey = apiKey;
                if (storageApiKey.startsWith('Bearer ')) {
                    storageApiKey = storageApiKey.substring(7).trim();
                }
                
                localStorage.setItem('openrouter_api_key', storageApiKey);
                
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
                
                apiKeyStatusEl.textContent = `Error: ${errorMessage}`;
                apiKeyStatusEl.style.color = '#f00';
            }
        } catch (error) {
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
            let formattedApiKey = apiKey;
            if (!formattedApiKey.startsWith('Bearer ')) {
                formattedApiKey = 'Bearer ' + formattedApiKey;
            }
            
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
        
        // Make sure the API key is properly formatted with Bearer prefix
        if (apiKey.startsWith('Bearer ')) {
            return apiKey;
        } else if (apiKey.startsWith('sk-or-')) {
            return 'Bearer ' + apiKey; // Add Bearer prefix for OpenRouter
        } else {
            console.warn('API key has unexpected format');
            return 'Bearer ' + apiKey; // Add Bearer prefix anyway
        }
    };
}); 