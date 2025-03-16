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
    
    // Watch for new messages being added to the DOM
    document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target && (e.target.classList && e.target.classList.contains('ai-message') || 
                         e.target.querySelector && e.target.querySelector('.ai-message'))) {
            fixHtmlTagsInMessages();
        }
    });
    
    // Also fix any messages that might already be in the DOM when the page loads
    fixHtmlTagsInMessages();
});
