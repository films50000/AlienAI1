/**
 * Function to play the alien mode transition sound
 */
function createAlienTransition() {
    try {
        const alienAudio = document.getElementById('alien-entry-music');
        if (alienAudio) {
            // Set volume
            alienAudio.volume = 0.7;
            // Reset playback position
            alienAudio.currentTime = 0;
            // Play the sound
            alienAudio.play().catch(error => {
                console.log("Error playing alien mode audio:", error);
            });
        } else {
            console.log("Alien audio element not found");
        }
    } catch (error) {
        console.error("Error in createAlienTransition:", error);
    }
}

// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if switchMode exists
    if (typeof switchMode === 'function') {
        // Store the original function
        const originalSwitchMode = switchMode;
        
        // Override the switchMode function
        window.switchMode = function(mode) {
            // Call the original function
            originalSwitchMode(mode);
            
            // If switching to alien mode, play the transition sound
            if (mode === 'alien') {
                createAlienTransition();
            }
        };
    } else {
        console.log("switchMode function not found");
    }
}); 