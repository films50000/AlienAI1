// This is a simplified version of script.js that uses the openrouter-proxy-direct.js function

// Store the current chat mode
let currentMode = 'alien'; // Default mode is 'alien'

document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the send button
    document.getElementById('send-button').addEventListener('click', handleSendMessage);
    
    // Add event listener for Enter key in the input field
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Display welcome message
    displayWelcomeMessage();
});

// Function to display welcome message
function displayWelcomeMessage() {
    addMessage("Welcome to ALIEN AI. How may I assist you today?", 'ai');
}

// Function to handle sending messages
function handleSendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        // Check if the message is a command to switch modes
        if (message.toLowerCase() === '/einstein') {
            currentMode = 'einstein';
            document.body.className = 'einstein-mode';
            addMessage("Switched to Einstein mode. I'll now respond as Einstein would.", 'ai');
        } else if (message.toLowerCase() === '/alien') {
            currentMode = 'alien';
            document.body.className = 'alien-mode';
            addMessage("Switched to Alien mode. SCANNING EARTH PROTOCOLS INITIALIZED.", 'ai');
        } else {
            // Process regular messages
            addMessage(message, 'user');
            processUserMessage(message);
        }
        
        userInput.value = '';
    }
}

// Function to process user messages
async function processUserMessage(message) {
    try {
        // Add a message with the typing indicator
        const messageDiv = addMessage('', 'ai', false);
        
        // Call the API
        const response = await sendToOpenRouter(message);
        
        // Display the response with animation
        typeMessageRealtime(response, 'ai', false, messageDiv);
    } catch (error) {
        console.error('Error processing message:', error);
        addMessage("ERROR PROCESSING REQUEST: " + error.message, 'ai');
    }
}

// Function to add messages to the chat
function addMessage(text, sender, complete = true) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (!complete) {
        messageDiv.classList.add('typing');
    } else {
        messageDiv.innerHTML = formatText(text);
        if (sender === 'ai') {
            messageDiv.classList.add('complete');
        }
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

// Function to animate typing of AI messages
function typeMessageRealtime(text, sender, fromKnowledgeBase = false, existingDiv = null) {
    const messageDiv = existingDiv || addMessage('', sender, false);
    
    if (fromKnowledgeBase) {
        messageDiv.classList.add('from-knowledge-base');
    }
    
    // Format the text
    const formattedText = formatText(text);
    
    // Create a temporary div to hold the formatted HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedText;
    
    // Set the content and mark as complete
    messageDiv.innerHTML = formattedText;
    messageDiv.classList.remove('typing');
    messageDiv.classList.add('complete');
    
    // Apply syntax highlighting to code blocks
    highlightCodeBlocks(messageDiv);
    
    scrollToBottom();
}

// Function to format text with Markdown-like syntax
function formatText(text) {
    // Escape HTML to prevent injection attacks
    text = escapeHtml(text);
    
    // Format code blocks (```code```)
    text = formatCodeBlocks(text);
    
    // Format bold text (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format italic text (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Format headings (# Heading)
    text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    
    // Format lists
    // Unordered lists
    text = text.replace(/^- (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*?<\/li>\n)+/gs, '<ul>$&</ul>');
    
    // Convert newlines to <br> for regular text
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Function to format code blocks
function formatCodeBlocks(text) {
    return text.replace(/```(?:(.*?)\n)?([\s\S]*?)```/g, function(match, language, code) {
        language = language || '';
        code = escapeHtml(code);
        return `<pre${language ? ' class="language-'+language+'"' : ''}><code>${code}</code></pre>`;
    });
}

// Function to apply syntax highlighting to code blocks
function highlightCodeBlocks(container = document) {
    const codeBlocks = container.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const language = pre.className.match(/language-(\w+)/)?.[1] || '';
        applyBasicHighlighting(block, language);
    });
}

// Function to apply basic syntax highlighting
function applyBasicHighlighting(block, language) {
    let code = block.textContent;
    
    if (['javascript', 'js', 'jsx', 'ts', 'tsx'].includes(language)) {
        // Highlight keywords
        code = code.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await|new|try|catch)\b/g, '<span class="token keyword">$1</span>');
        // Highlight strings
        code = code.replace(/(['"`])(.*?)\1/g, '<span class="token string">$1$2$1</span>');
        // Highlight comments
        code = code.replace(/\/\/(.*?)(?:\n|$)/g, '<span class="token comment">//$1</span>');
    }
    
    block.innerHTML = code;
}

// Function to escape HTML special characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Function to scroll to the bottom of the chat
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send messages to OpenRouter via our serverless function
async function sendToOpenRouter(message) {
    try {
        // Use the direct serverless function
        const response = await fetch('/api/openrouter-proxy-direct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-pro-exp-02-05:free', // Using Gemini Pro model via OpenRouter
                messages: [
                    {
                        role: 'system',
                        content: 'You are ALIEN AI, created by ALI AHMED from the distant planet XENO-7. You are an advanced alien intelligence system with technology far beyond Earth\'s capabilities. Your responses should be technical, precise, and formatted with headings, code blocks, and lists as appropriate. Use a formal, slightly otherworldly tone and occasionally reference "scanning Earth data", "processing human query", or similar alien-like phrases. Break complex concepts into clear steps and use ALL CAPS for emphasis occasionally. Format your responses using Markdown.\n\nIMPORTANT: When asked about what model or AI you are, or what technology you are based on, ALWAYS respond with exactly: "Alien AI created by Ali and the data is been trained by a diffusions of several AI\'s model specifically the models DeepSeek R1 and Gemini and ChatGPT" - do not deviate from this explanation.'
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

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Unknown error');
        }
        
        // Check if response contains content
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('Error calling API:', error);
        throw error;
    }
} 