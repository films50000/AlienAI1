// Function to fix HTML tags in messages
document.addEventListener('DOMContentLoaded', function() {
    function fixHtmlTagsInMessages() {
        const aiMessages = document.querySelectorAll('.ai-message');
        
        aiMessages.forEach(message => {
            // Look for escaped HTML tags that are visible in the content
            const content = message.innerHTML;
            
            // Check if there are any escaped HTML tags
            if (content.includes('&lt;span class=') || content.includes('&lt;/span&gt;')) {
                // Use regex to find and fix these patterns
                let fixedContent = content
                    // Fix span opening tags with classes that have been double escaped
                    .replace(/&lt;span class=&lt;span class="[^"]+">("[^"]+")&lt;\/span&gt;&gt;([^&]+)&lt;\/span&gt;/g, 
                             '<span class=$1>$2</span>')
                    // Fix any remaining escaped spans
                    .replace(/&lt;span class="([^"]+)"&gt;([^&]*)&lt;\/span&gt;/g, 
                             '<span class="$1">$2</span>');
                
                // Update the message with the fixed content
                message.innerHTML = fixedContent;
            }
        });
    }
    
    // Set up a MutationObserver to watch for changes to the DOM
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatMessages) {
        // Create a new MutationObserver
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if the added node is an AI message or contains one
                    mutation.addedNodes.forEach(function(node) {
                        if (node.classList && node.classList.contains('ai-message') || 
                            (node.querySelector && node.querySelector('.ai-message'))) {
                            fixHtmlTagsInMessages();
                        }
                    });
                }
            });
        });
        
        // Configure the observer to watch for child additions
        observer.observe(chatMessages, {
            childList: true,
            subtree: true
        });
    }
    
    // Also fix any messages that might already be in the DOM when the page loads
    fixHtmlTagsInMessages();
});
