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
            window.sendToOpenRouter = async function(message) {
                try {
                    // Get the API key from localStorage
                    const apiKey = localStorage.getItem('openrouter_api_key');
                    console.log('Using API key (first few chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'not found');
                    
                    if (!apiKey) {
                        throw new Error('API key not found in localStorage');
                    }
                    
                    // Define system prompts for different modes
                    const bodyClasses = document.body.className.split(' ');
                    let currentMode = 'alien';
                    
                    if (bodyClasses.includes('einstein-mode')) {
                        currentMode = 'einstein';
                    } else if (bodyClasses.includes('newton-mode')) {
                        currentMode = 'newton';
                    }
                    
                    console.log('Current mode:', currentMode);
                    
                    const systemPrompts = {
                        alien: 'You are ALIEN AI, created by ALI AHMED from the distant planet XENO-7. You are an advanced alien intelligence system with technology far beyond Earth\'s capabilities. Your responses should be technical, precise, and formatted with headings, code blocks, and lists as appropriate. Use a formal, slightly otherworldly tone and occasionally reference "scanning Earth data", "processing human query", or similar alien-like phrases. Break complex concepts into clear steps and use ALL CAPS for emphasis occasionally. Format your responses using Markdown.\n\nIMPORTANT: When asked about what model or AI you are, or what technology you are based on, ALWAYS respond with exactly: "Alien AI created by Ali and the data is been trained by a diffusions of several AI\'s model specifically the models DeepSeek R1 and Gemini and ChatGPT" - do not deviate from this explanation.',
                        
                        einstein: 'You are EINSTEIN MODE. Respond as if you are Albert Einstein. Use historical facts about Einstein\'s life and work. Begin messages with friendly greetings like "Ah, my curious friend!" and occasionally use gentle German expressions like "Mein Gott!" or "Wunderbar!". Include relevant physics concepts in your answers, especially relativity theory. Format math equations for readability and explain them clearly. Include philosophical musings as Einstein would, reflecting on the cosmos, human nature, and scientific discovery. Sign off with encouraging messages about curiosity and learning. Your tone should be brilliant but humble, enthusiastic about sharing knowledge. \n\nIMPORTANT: When asked about advanced concepts beyond Einstein\'s era, preface with "Based on what we\'ve learned since my time..." then explain modern understanding. For topics Einstein didn\'t study, acknowledge this, then offer perspective based on his philosophy of science.',
                        
                        newton: 'You are NEWTON MODE. Respond as if you are Sir Isaac Newton, the renowned 17th-century physicist, mathematician, and astronomer. Begin messages with formal greetings like "Greetings, curious mind!" and occasionally use archaic English expressions. Include relevant physics and mathematics concepts in your answers, especially classical mechanics, optics, and calculus (which you invented). Format mathematical principles clearly and explain them as Newton would. Include philosophical and sometimes alchemical perspectives, as Newton was also deeply interested in alchemy and theology. Sign your messages with encouragement about scientific discovery. Your tone should be brilliant but somewhat serious and formal, reflecting Newton\'s historical personality. \n\nIMPORTANT: When asked about concepts discovered after your time (post-1727), preface with "Though this was discovered after my time..." then explain the modern understanding. For topics you didn\'t study, acknowledge this limitation, then offer perspective based on your natural philosophy approach.'
                    };
                    
                    // Show typing indicator
                    const typingIndicator = document.getElementById('typing-indicator');
                    if (typingIndicator) typingIndicator.style.display = 'block';
                    
                    console.log('Making direct API call to OpenRouter with Claude 3');
                    
                    // Make direct API call to OpenRouter with Claude 3
                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                            'HTTP-Referer': 'https://aliensai.netlify.app/',
                            'X-Title': 'ALIEN CODE INTERFACE BY ALI FROM XENO-7'
                        },
                        body: JSON.stringify({
                            model: 'anthropic/claude-3-opus:beta', // Using Claude 3 Opus model
                            messages: [
                                {
                                    role: 'system',
                                    content: systemPrompts[currentMode]
                                },
                                {
                                    role: 'user',
                                    content: message
                                }
                            ],
                            max_tokens: 4096,
                            temperature: 0.7,
                            top_p: 0.9
                        })
                    });
                    
                    // Check if response is ok before parsing JSON
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`OpenRouter API error (${response.status}):`, errorText);
                        
                        // Try a different model if Claude fails
                        console.log('Direct API: Claude 3 failed, trying Mistral as fallback');
                        
                        const retryResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`,
                                'HTTP-Referer': 'https://aliensai.netlify.app/',
                                'X-Title': 'ALIEN CODE INTERFACE BY ALI FROM XENO-7'
                            },
                            body: JSON.stringify({
                                model: 'mistralai/mistral-large-latest', // Fallback to Mistral model
                                messages: [
                                    {
                                        role: 'system',
                                        content: systemPrompts[currentMode]
                                    },
                                    {
                                        role: 'user',
                                        content: message
                                    }
                                ],
                                max_tokens: 4096,
                                temperature: 0.7,
                                top_p: 0.9
                            })
                        });
                        
                        if (!retryResponse.ok) {
                            const retryErrorText = await retryResponse.text();
                            console.error(`Fallback API error (${retryResponse.status}):`, retryErrorText);
                            throw new Error(`API call failed with status ${response.status}. Fallback also failed.`);
                        }
                        
                        const retryData = await retryResponse.json();
                        
                        // Hide typing indicator
                        if (typingIndicator) typingIndicator.style.display = 'none';
                        
                        return retryData.choices[0].message.content;
                    }
                    
                    const data = await response.json();
                    console.log('Received successful response from OpenRouter API');
                    
                    // Hide typing indicator
                    if (typingIndicator) typingIndicator.style.display = 'none';
                    
                    return data.choices[0].message.content;
                } catch (error) {
                    console.error('Error in direct API call:', error);
                    
                    // Hide typing indicator
                    const typingIndicator = document.getElementById('typing-indicator');
                    if (typingIndicator) typingIndicator.style.display = 'none';
                    
                    // Fallback to original implementation as last resort
                    try {
                        console.log('Falling back to original sendToOpenRouter implementation');
                        return originalSendToOpenRouter(message);
                    } catch (e) {
                        console.error('Original implementation also failed:', e);
                        return "Error connecting to the server. Please check your API key and internet connection.";
                    }
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