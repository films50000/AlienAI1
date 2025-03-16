// API Helper for AlienAI
document.addEventListener('DOMContentLoaded', function() {
    console.log('API Helper for AlienAI initialized');
    
    // The default key used by script.js
    const defaultKey = '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';
    
    // Ensure the API key is properly set, only if not already set
    if (!localStorage.getItem('openrouter_api_key')) {
        localStorage.setItem('openrouter_api_key', defaultKey);
        console.log('API key initialized');
    }
    
    // Store original functions
    const originalFetch = window.fetch;
    
    // Helpful debug function
    window.checkApiKey = function() {
        const key = localStorage.getItem('openrouter_api_key');
        console.log('Current API key:', key ? key.substring(0, 10) + '...' : 'Not set');
        return key;
    };
    
    console.log('API Helper initialized. You can call window.checkApiKey() in console to verify the API key.');
}); 