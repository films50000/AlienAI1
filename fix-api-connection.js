// This script fixes API connection issues by intercepting direct calls to OpenRouter API
// and redirecting them through the Netlify function proxy
document.addEventListener('DOMContentLoaded', function() {
    console.log('API connection fixer initialized');
    
    // Store the original fetch function
    const originalFetch = window.fetch;
    
    // Override the fetch function to intercept OpenRouter API calls
    window.fetch = function(url, options = {}) {
        // Check if this is a direct call to OpenRouter API
        if (url === 'https://openrouter.ai/api/v1/chat/completions') {
            console.log('Intercepted direct OpenRouter API call, redirecting to Netlify function');
            
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
    
    console.log('API connection fix applied - direct OpenRouter API calls will be redirected');
}); 