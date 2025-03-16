// Simple fix for API connection issues
document.addEventListener('DOMContentLoaded', function() {
    console.log('API connection helper initialized');
    
    // Ensure the API key is properly set
    const storedKey = localStorage.getItem('openrouter_api_key');
    if (!storedKey) {
        // If no key in localStorage, restore the default one from script.js
        const defaultKey = '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';
        localStorage.setItem('openrouter_api_key', defaultKey);
        console.log('Default API key restored');
    }
    
    // Don't override fetch or other functions - just make sure the key is available
    console.log('API connection helper completed');
}); 