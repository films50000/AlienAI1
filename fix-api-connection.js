// Simple script to fix API connection issues by ensuring localStorage has the API key
document.addEventListener('DOMContentLoaded', function() {
    console.log('API connection fixer initialized');
    
    // The most likely issue is that the localStorage API key is not being used properly
    // Let's try a simple fix by directly using the server's API key
    const apiKeyField = document.getElementById('api-key-input');
    
    // Create a wrapper around the fetch function
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Check if this is a direct call to OpenRouter API
        if (url && url.includes('openrouter.ai/api/v1/chat/completions')) {
            console.log('Intercepting direct OpenRouter API call');
            
            // Redirect to our Netlify function proxy
            return originalFetch('/api/openrouter-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: options ? options.body : null
            });
        }
        
        // For all other API calls, use the original fetch function
        return originalFetch.apply(this, arguments);
    };
    
    console.log('API connection fix applied: All direct OpenRouter API calls are now redirected to the serverless function proxy');
}); 