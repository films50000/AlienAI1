// This script fixes API connection issues by intercepting direct calls to OpenRouter API
// and redirecting them through the Netlify function proxy
document.addEventListener('DOMContentLoaded', function() {
    console.log('API connection fixer initialized');
    
    // Ensure the API key is available (don't overwrite if already set)
    const defaultKey = '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';
    if (!localStorage.getItem('openrouter_api_key')) {
        localStorage.setItem('openrouter_api_key', defaultKey);
        console.log('API key initialized by fix-api-connection.js');
    }
    
    // Store the original fetch function
    const originalFetch = window.fetch;
    
    // Override the fetch function to intercept OpenRouter API calls
    window.fetch = function(url, options = {}) {
        // Check if this is a direct call to OpenRouter API
        if (url === 'https://openrouter.ai/api/v1/chat/completions') {
            console.log('Intercepted direct OpenRouter API call, redirecting to Netlify function');
            
            // Get the API key from localStorage
            const apiKey = localStorage.getItem('openrouter_api_key');
            if (!apiKey) {
                console.error('API key not found in localStorage');
            }
            
            // Redirect to the Netlify function
            return originalFetch('/api/openrouter-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: options.body // Pass through the original request body
            });
        }
        
        // For all other requests, use the original fetch
        return originalFetch(url, options);
    };
    
    // Set a global flag to indicate that the fix has been applied
    window.apiConnectionFixApplied = true;
    
    console.log('API connection fix applied - direct OpenRouter API calls will be redirected');
}); 