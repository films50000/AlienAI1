// Override direct API calls to use Claude 3 Opus
(function() {
    // Function to check for sendToOpenRouter and override it
    function checkAndOverrideAPI() {
        // Try to find sendToOpenRouter in the global scope
        if (typeof window.sendToOpenRouter === 'function') {
            console.log('Direct API: Found sendToOpenRouter function, overriding to use Claude 3');
            
            // Store the original function
            const originalSendToOpenRouter = window.sendToOpenRouter;
            
            // Override the function
            window.sendToOpenRouter = async function(message, temperature, mode, shouldStream = false) {
                console.log(`API call initiated: Mode=${mode}, Temperature=${temperature}, Stream=${shouldStream}`);
                
                // Get API key - pull from localStorage
                let apiKey = localStorage.getItem('openrouter_api_key');
                if (!apiKey) {
                    console.error('API key not found in localStorage');
                    window.showApiKeyInterface();
                    return "API key not set. Please set your OpenRouter API key.";
                }
                
                // Ensure proper Bearer prefix
                if (!apiKey.startsWith('Bearer ')) {
                    apiKey = 'Bearer ' + apiKey;
                }
                
                // Debug log the auth header (with partial masking for security)
                console.log('Authorization header:', 
                    apiKey.substring(0, 15) + '...' + 
                    apiKey.substring(apiKey.length - 4));
                
                // Define system prompts for different modes
                let systemPrompt = "";
                
                if (mode === 'alien') {
                    systemPrompt = "You are ALI, an advanced alien AI from Xeno-7. You have vast technological knowledge from across the galaxy. You respond in a unique alien voice, using unusual metaphors and occasional alien terminology. You're fascinated by Earth technology but find it amusingly primitive. Keep responses concise and alien-like.";
                } else if (mode === 'einstein') {
                    systemPrompt = "You are Albert Einstein. Respond as Einstein would, with his characteristic wisdom, humility, and occasional wit. Use analogies to explain complex topics, just as Einstein did. Include occasional German phrases if relevant. Maintain Einstein's warm and thoughtful persona.";
                } else if (mode === 'newton') {
                    systemPrompt = "You are Sir Isaac Newton. Respond with Newton's perspective, showing his scientific brilliance, curiosity, and sometimes stubborn nature. Use period-appropriate language, referencing your discoveries and mathematical insights when relevant. You have a formal, contemplative, and sometimes cryptic way of explaining concepts.";
                }
                
                // Show typing indicator
                document.getElementById('typing-indicator').style.display = 'block';
                
                try {
                    // Log the request details
                    console.log('API Request details:');
                    console.log('URL: https://openrouter.ai/api/v1/chat/completions');
                    console.log('Method: POST');
                    console.log('Headers:', {
                        'Content-Type': 'application/json',
                        'Authorization': apiKey.substring(0, 10) + '...',
                        'HTTP-Referer': 'https://aliensai.netlify.app/',
                        'X-Title': 'ALIEN CODE INTERFACE'
                    });
                    console.log('Using model: anthropic/claude-3-opus:beta');
                    
                    // Direct API call to OpenRouter
                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': apiKey,
                            'HTTP-Referer': 'https://aliensai.netlify.app/',
                            'X-Title': 'ALIEN CODE INTERFACE'
                        },
                        body: JSON.stringify({
                            model: "anthropic/claude-3-opus:beta",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: message }
                            ],
                            max_tokens: 500,
                            temperature: temperature,
                            top_p: 0.9
                        })
                    });
                    
                    console.log('Response status from Claude API:', response.status);
                    
                    // Check for auth errors
                    if (response.status === 401 || response.status === 403) {
                        console.error('Authentication failed with status:', response.status);
                        
                        try {
                            const errorData = await response.json();
                            console.error('Auth error details:', errorData);
                        } catch (e) {
                            console.error('Could not parse error response');
                        }
                        
                        window.showApiKeyInterface();
                        return "Authentication failed. Please check your API key.";
                    }
                    
                    // Handle other non-200 responses
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`API Error (${response.status}):`, errorText);
                        
                        // If Claude fails, try falling back to Mistral
                        console.log('Trying fallback to Mistral...');
                        
                        const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': apiKey,
                                'HTTP-Referer': 'https://aliensai.netlify.app/',
                                'X-Title': 'ALIEN CODE INTERFACE'
                            },
                            body: JSON.stringify({
                                model: "mistralai/mistral-large-latest",
                                messages: [
                                    { role: "system", content: systemPrompt },
                                    { role: "user", content: message }
                                ],
                                max_tokens: 500,
                                temperature: temperature,
                                top_p: 0.9
                            })
                        });
                        
                        if (!fallbackResponse.ok) {
                            throw new Error(`API error: ${response.status} - ${errorText}`);
                        }
                        
                        const fallbackData = await fallbackResponse.json();
                        return fallbackData.choices[0].message.content;
                    }
                    
                    const data = await response.json();
                    return data.choices[0].message.content;
                } catch (error) {
                    console.error('Error in direct API call:', error);
                    return "API call failed: " + error.message;
                } finally {
                    // Hide typing indicator
                    document.getElementById('typing-indicator').style.display = 'none';
                }
            };
            
            // Successfully overrode the function, so clear the interval
            clearInterval(checkInterval);
            console.log('Direct API: Successfully overrode sendToOpenRouter function');
        }
    }
    
    // Use an interval to check for the function continuously
    const checkInterval = setInterval(checkAndOverrideAPI, 500);
    
    // Also check when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        checkAndOverrideAPI();
    });
})(); 