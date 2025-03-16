// API Proxy Script for Netlify Functions
(function() {
    // Keep track of initialization
    let initialized = false;
    
    // Function to check if main.js has loaded the required functions
    function checkAndInitialize() {
        if (typeof sendToOpenRouter === 'function') {
            console.log('API Proxy: Main script loaded, overriding sendToOpenRouter');
            initializeProxy();
            initialized = true;
            clearInterval(checkInterval);
        }
    }
    
    // Function to initialize our API proxy
    function initializeProxy() {
        // Store the original function
        const originalSendToOpenRouter = window.sendToOpenRouter;
        
        // Override the function
        window.sendToOpenRouter = async function(message) {
            // Show typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) typingIndicator.style.display = 'block';
            
            try {
                // Get current mode from body class
                const bodyClasses = document.body.className.split(' ');
                let currentMode = 'alien';
                
                if (bodyClasses.includes('einstein-mode')) {
                    currentMode = 'einstein';
                } else if (bodyClasses.includes('newton-mode')) {
                    currentMode = 'newton';
                }
                
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
                
                // Use direct API call as fallback if Netlify function fails
                try {
                    console.log('API Proxy: Attempting to use Netlify function');
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
                    
                    // Check if response is OK
                    if (!response.ok) {
                        console.log(`API Proxy: Netlify function failed with status ${response.status}`);
                        const errorText = await response.text();
                        console.error('Error response:', errorText);
                        
                        try {
                            const errorJson = JSON.parse(errorText);
                            console.error('Parsed error:', errorJson);
                        } catch (e) {
                            // If it's not JSON, just log the text
                            console.error('Response was not JSON');
                        }
                        
                        // Hide typing indicator
                        if (typingIndicator) typingIndicator.style.display = 'none';
                        
                        // Try direct API call as fallback
                        console.log('API Proxy: Attempting direct API call as fallback');
                        return originalSendToOpenRouter(message);
                    }
                    
                    const data = await response.json();
                    
                    // Hide typing indicator
                    if (typingIndicator) typingIndicator.style.display = 'none';
                    
                    // Check if the response has the expected structure
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        return data.choices[0].message.content;
                    } else {
                        // If the structure is different, try to extract content
                        console.error('API Proxy: Unexpected API response structure:', data);
                        if (data.content) return data.content;
                        if (typeof data === 'string') return data;
                        throw new Error('Unexpected response format from API');
                    }
                } catch (error) {
                    console.log('API Proxy: Error using Netlify function, falling back to original implementation', error);
                    // Hide typing indicator
                    if (typingIndicator) typingIndicator.style.display = 'none';
                    // Fall back to original implementation
                    return originalSendToOpenRouter(message);
                }
            } catch (error) {
                console.error('API Proxy: Error:', error);
                if (typingIndicator) typingIndicator.style.display = 'none';
                
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
    }
    
    // Set up an interval to check if the main script has loaded
    const checkInterval = setInterval(checkAndInitialize, 500);
    
    // Also attempt to initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        checkAndInitialize();
    });
})(); 