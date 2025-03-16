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

// Fallback implementation of switchMode in case script.js doesn't load properly
if (typeof window.switchMode !== 'function') {
    window.switchMode = function(mode) {
        console.log("Using fallback switchMode function for mode:", mode);
        
        // Remove current mode classes
        document.body.classList.remove('alien-mode', 'einstein-mode', 'newton-mode');
        
        // Add the new mode class
        document.body.classList.add(mode + '-mode');
        
        // Update UI based on the selected mode
        const modelIndicator = document.querySelector('.model-indicator');
        if (modelIndicator) {
            if (mode === 'alien') {
                modelIndicator.innerHTML = 'ALIEN AI';
            } else if (mode === 'einstein') {
                modelIndicator.innerHTML = 'EINSTEIN MODE';
            } else if (mode === 'newton') {
                modelIndicator.innerHTML = 'NEWTON MODE';
            }
        }
        
        // If switching to alien mode, play the transition sound
        if (mode === 'alien') {
            createAlienTransition();
        }
    };
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
        console.log("switchMode function not found, using fallback");
    }
}); 