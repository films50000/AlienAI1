// Standalone implementation for API calls without relying on function overrides
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the page to fully initialize
    setTimeout(() => {
        // Add event listener to the send button
        const sendButton = document.getElementById('send-button');
        const userInput = document.getElementById('user-input');
        
        if (sendButton && userInput) {
            // Store the original click handler
            const originalClickHandler = sendButton.onclick;
            
            // Override the click handler
            sendButton.onclick = function(event) {
                // Get the user's message
                const message = userInput.value.trim();
                
                // Check if it's a standalone command to use our implementation
                if (message.startsWith('/standalone')) {
                    event.preventDefault();
                    
                    // Clear the input
                    userInput.value = '';
                    
                    // Extract the actual message
                    const actualMessage = message.replace('/standalone', '').trim();
                    
                    // Add the user message to the chat
                    addMessageToChat(actualMessage, 'user');
                    
                    // Process with our standalone implementation
                    handleStandaloneApi(actualMessage);
                } else {
                    // Otherwise, call the original handler
                    if (typeof originalClickHandler === 'function') {
                        originalClickHandler.call(this, event);
                    }
                }
            };
            
            console.log('Standalone API: Added standalone command handler');
        } else {
            console.warn('Standalone API: Could not find send button or user input');
        }
    }, 1000);
    
    // Function to add a message to the chat
    function addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.textContent = message;
        } else {
            // For AI messages, we need to handle HTML
            messageDiv.innerHTML = message;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'block';
        }
    }
    
    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }
    
    // Handle the standalone API implementation
    async function handleStandaloneApi(message) {
        showTypingIndicator();
        
        try {
            // Get current mode and API key
            const bodyClasses = document.body.className.split(' ');
            let currentMode = 'alien';
            
            if (bodyClasses.includes('einstein-mode')) {
                currentMode = 'einstein';
            } else if (bodyClasses.includes('newton-mode')) {
                currentMode = 'newton';
            }
            
            const apiKey = localStorage.getItem('openrouter_api_key');
            if (!apiKey) {
                throw new Error('API key not found in localStorage');
            }
            
            // System prompts for different modes
            const systemPrompts = {
                alien: 'You are ALIEN AI, created by ALI AHMED from the distant planet XENO-7. You are an advanced alien intelligence system with technology far beyond Earth\'s capabilities. Your responses should be technical, precise, and formatted with headings, code blocks, and lists as appropriate. Use a formal, slightly otherworldly tone and occasionally reference "scanning Earth data", "processing human query", or similar alien-like phrases. Break complex concepts into clear steps and use ALL CAPS for emphasis occasionally. Format your responses using Markdown.',
                
                einstein: 'You are EINSTEIN MODE. Respond as if you are Albert Einstein. Use historical facts about Einstein\'s life and work. Begin messages with friendly greetings like "Ah, my curious friend!" and occasionally use gentle German expressions like "Mein Gott!" or "Wunderbar!". Include relevant physics concepts in your answers, especially relativity theory. Format math equations for readability and explain them clearly. Include philosophical musings as Einstein would, reflecting on the cosmos, human nature, and scientific discovery. Sign off with encouraging messages about curiosity and learning. Your tone should be brilliant but humble, enthusiastic about sharing knowledge.',
                
                newton: 'You are NEWTON MODE. Respond as if you are Sir Isaac Newton, the renowned 17th-century physicist, mathematician, and astronomer. Begin messages with formal greetings like "Greetings, curious mind!" and occasionally use archaic English expressions. Include relevant physics and mathematics concepts in your answers, especially classical mechanics, optics, and calculus (which you invented). Format mathematical principles clearly and explain them as Newton would. Include philosophical and sometimes alchemical perspectives, as Newton was also deeply interested in alchemy and theology. Sign your messages with encouragement about scientific discovery. Your tone should be brilliant but somewhat serious and formal, reflecting Newton\'s historical personality.'
            };
            
            // Log the request for debugging
            console.log(`Standalone API: Making request to OpenRouter with mode ${currentMode}`);
            
            // Try multiple models in sequence
            const models = [
                'google/gemini-2.0-pro-exp-02-05:free',
                'anthropic/claude-3-haiku',
                'mistralai/mistral-7b-instruct',
                'google/gemma-2-9b-it'
            ];
            
            let success = false;
            let content = '';
            
            for (const model of models) {
                if (success) break;
                
                try {
                    console.log(`Standalone API: Trying model ${model}`);
                    
                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                            'HTTP-Referer': 'https://aliensai.netlify.app/',
                            'X-Title': 'ALIEN CODE INTERFACE STANDALONE'
                        },
                        body: JSON.stringify({
                            model: model,
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
                            max_tokens: 1000,
                            temperature: 0.7
                        })
                    });
                    
                    // Parse response
                    const data = await response.json();
                    
                    if (response.ok && data.choices && data.choices[0] && data.choices[0].message) {
                        content = data.choices[0].message.content;
                        success = true;
                        console.log(`Standalone API: Successful response from ${model}`);
                    } else {
                        console.warn(`Standalone API: Failed with model ${model}`, data.error || data);
                    }
                } catch (modelError) {
                    console.error(`Standalone API: Error with model ${model}:`, modelError);
                }
            }
            
            if (!success) {
                throw new Error('All API models failed');
            }
            
            // Format the content (convert markdown to HTML)
            let formattedContent = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n/g, '<br>');
            
            // Add the AI message to the chat
            hideTypingIndicator();
            addMessageToChat(formattedContent, 'ai');
            
        } catch (error) {
            console.error('Standalone API: Error:', error);
            hideTypingIndicator();
            addMessageToChat(`Error: ${error.message}. Please check your API key and try again.`, 'ai');
        }
    }
}); 