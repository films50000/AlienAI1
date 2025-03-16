// This script ensures the API key is available and redirects API calls to the Netlify function
document.addEventListener('DOMContentLoaded', function() {
    console.log('API proxy initialized');
    
    // First, ensure the API key is available (don't overwrite if already set)
    const defaultKey = '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';
    if (!localStorage.getItem('openrouter_api_key')) {
        localStorage.setItem('openrouter_api_key', defaultKey);
        console.log('API key initialized by api-proxy.js');
    }
    
    // Add a debug helper function
    window.checkApiKey = function() {
        const key = localStorage.getItem('openrouter_api_key');
        console.log('Current API key:', key ? key.substring(0, 10) + '...' : 'Not set');
        return key;
    };
    
    // Check if the fix-api-connection.js script has already applied a fetch override
    if (window.apiConnectionFixApplied) {
        console.log('API connection fix already applied, skipping fetch override');
    }
    
    // Check if sendToOpenRouter function exists
    if (typeof sendToOpenRouter === 'function') {
        console.log('Overriding sendToOpenRouter to use Netlify function');
        
        // Store the original function
        const originalFunction = sendToOpenRouter;
        
        // Override the function
        window.sendToOpenRouter = async function(message) {
            // Show typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            typingIndicator.style.display = 'block';
            
            try {
                const currentMode = document.getElementById('mode-select').value || 'alien';
                
                // Define system prompts for different modes
                const systemPrompts = {
                    alien: "You are XENORITHM, an advanced alien AI that landed on Earth. Always respond in the style of an alien who is highly intelligent but unfamiliar with human culture. Use phrases like 'your Earth concepts' and occasionally mention your advanced alien technology. Add {{brackets}} around technical terms or alien concepts. Your responses should be insightful but with an otherworldly perspective.",
                    einstein: "You are Albert Einstein, the brilliant physicist. Respond in the style of Einstein, with a German accent, philosophical musings, and references to relativity and physics when relevant. Use phrases like 'Mein Freund' (my friend) and 'Vunderful!' occasionally. Be thoughtful and kind but approach topics from a scientific and philosophical perspective.",
                    newton: "You are Sir Isaac Newton, the father of physics and calculus. Speak formally as a 17th-century English scientist would. Reference your work on gravity, mathematics, and natural philosophy. Use archaic terms occasionally, mention your rivalry with Leibniz when mathematics is discussed, and be a bit eccentric but brilliant in your responses."
                };
                
                // Enhancement for Einstein mode to reference his theories
                let enhancedPrompt = systemPrompts[currentMode];
                if (currentMode === 'einstein') {
                    const physicsTerms = ['relativity', 'quantum', 'energy', 'mass', 'gravity', 'physics', 'light', 'space', 'time', 'dimension'];
                    const hasPhysicsTerm = physicsTerms.some(term => message.toLowerCase().includes(term));
                    
                    if (hasPhysicsTerm) {
                        enhancedPrompt += " For this response, include a brief reference to one of your famous theories or equations that relates to the topic.";
                    }
                }
                
                // Call the Netlify function instead of OpenRouter directly
                const response = await fetch('/api/openrouter-proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'google/gemini-2.0-pro-exp-02-05:free',
                        messages: [
                            { role: 'system', content: enhancedPrompt },
                            { role: 'user', content: message }
                        ],
                        max_tokens: 4096,
                        temperature: 0.7,
                        top_p: 0.9
                    })
                });
                
                // Handle response
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error connecting to API');
                }
                
                const data = await response.json();
                
                // Hide typing indicator
                typingIndicator.style.display = 'none';
                
                // Check if the response has the expected structure
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    return data.choices[0].message.content;
                } else {
                    // If the structure is different, try to extract content
                    console.error('Unexpected API response structure:', data);
                    if (data.content) return data.content;
                    if (typeof data === 'string') return data;
                    throw new Error('Unexpected response format from API');
                }
            } catch (error) {
                console.error('API Error:', error);
                typingIndicator.style.display = 'none';
                
                // Check if it's an authentication error
                if (error.message && (
                    error.message.includes('API key') || 
                    error.message.includes('authentication') || 
                    error.message.includes('credentials')
                )) {
                    return "Error connecting to the server. Please check your API key and internet connection.";
                }
                
                return "I apologize, but I'm experiencing a technical issue. Please try again later.";
            }
        };
    } else {
        console.warn('sendToOpenRouter function not found, could not override');
    }
}); 