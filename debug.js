// Debug script to help identify issues with the AlienAI chat interface
console.log('Debug script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - debug script running');
    
    // Check if key elements exist
    const elements = {
        'user-input': document.getElementById('user-input'),
        'send-button': document.getElementById('send-button'),
        'chat-messages': document.getElementById('chat-messages')
    };
    
    console.log('Element check:');
    for (const [name, element] of Object.entries(elements)) {
        console.log(`- ${name}: ${element ? 'Found' : 'MISSING'}`);
    }
    
    // Add debug event listeners
    if (elements['send-button']) {
        elements['send-button'].addEventListener('click', () => {
            console.log('Debug: Send button clicked');
        });
    }
    
    if (elements['user-input']) {
        elements['user-input'].addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                console.log('Debug: Enter key pressed');
            }
        });
    }
    
    // Verify script-netlify.js loaded correctly
    if (typeof sendToOpenRouter === 'function') {
        console.log('script-netlify.js loaded correctly - sendToOpenRouter function exists');
    } else {
        console.error('script-netlify.js may not be loaded correctly - sendToOpenRouter function not found');
    }
    
    // Add a test message to verify message display works
    setTimeout(() => {
        try {
            const testMessage = document.createElement('div');
            testMessage.classList.add('message', 'ai-message');
            testMessage.textContent = 'Debug: This is a test message to verify the chat display works.';
            
            if (elements['chat-messages']) {
                elements['chat-messages'].appendChild(testMessage);
                console.log('Test message added successfully');
            } else {
                console.error('Could not add test message - chat-messages container not found');
            }
        } catch (error) {
            console.error('Error adding test message:', error);
        }
    }, 2000);
});

// Add a global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error: error?.toString() });
    
    // Add error message to chat if possible
    try {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            const errorElement = document.createElement('div');
            errorElement.classList.add('message', 'ai-message', 'error-message');
            errorElement.innerHTML = `
                <strong>Debug: JavaScript Error Detected</strong><br>
                ${message}<br>
                Source: ${source}<br>
                Line: ${lineno}, Column: ${colno}
            `;
            messagesContainer.appendChild(errorElement);
        }
    } catch (e) {
        // Don't let the error handler cause more errors
        console.error('Error in error handler:', e);
    }
    
    return false; // Let the error propagate
}; 