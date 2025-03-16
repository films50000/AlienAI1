document.addEventListener('DOMContentLoaded', () => {
    // Store the OpenRouter API key provided by the user
    localStorage.setItem('openrouter_api_key', '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');
    
    // Add these styles back
    const style = document.createElement('style');
    style.textContent = `
        .ai-message:not(.complete) {
            position: relative;
        }

        .ai-message:not(.complete)::after {
            content: "";
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-left: 5px;
            background-color: var(--primary-color);
            border-radius: 50%;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        /* Alien effects */
        @keyframes glitch {
            0% {
                transform: translate(0);
            }
            20% {
                transform: translate(-2px, 2px);
            }
            40% {
                transform: translate(-2px, -2px);
            }
            60% {
                transform: translate(2px, 2px);
            }
            80% {
                transform: translate(2px, -2px);
            }
            100% {
                transform: translate(0);
            }
        }
        
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            33% { opacity: 0.8; }
            66% { opacity: 0.6; }
        }
        
        @keyframes textShadow {
            0% {
                text-shadow: 0.25px 0 1px rgba(0, 230, 118, 0.5), -0.25px 0 1px rgba(10, 230, 255, 0.3);
            }
            33% {
                text-shadow: -0.25px 0 1px rgba(0, 230, 118, 0.5), 0.25px 0 1px rgba(10, 230, 255, 0.3);
            }
            66% {
                text-shadow: 0.125px 0 1px rgba(0, 230, 118, 0.5), -0.125px 0 1px rgba(10, 230, 255, 0.3);
            }
            100% {
                text-shadow: 0.25px 0 1px rgba(0, 230, 118, 0.5), -0.25px 0 1px rgba(10, 230, 255, 0.3);
            }
        }
        
        .alien-glow {
            text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color);
            animation: textShadow 3s infinite linear;
        }
        
        .alien-char {
            display: inline-block;
            opacity: 0;
            transform: translateY(10px);
            animation-fill-mode: forwards;
        }
        
        .alien-char.glitch {
            animation: glitch 0.3s ease forwards;
        }
        
        .alien-word {
            display: inline-block;
            margin-right: 4px;
        }
        
        .alien-highlight {
            color: var(--accent-color);
            animation: flicker 2s infinite;
        }
    `;
    document.head.appendChild(style);

    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Add current mode variable
    let currentMode = 'alien'; // Default mode
    
    // Add a message to indicate the API key has been set
    setTimeout(() => {
        addMessage("API key set successfully. The chat is now connected to OpenRouter with your API key. You can switch modes by typing /einstein or /alien in the chat.", 'ai');
    }, 1000);
    
    // Function to switch between modes (alien, einstein, newton)
    function switchMode(mode) {
        if (mode === currentMode) return;
        
        currentMode = mode;
        document.body.className = mode + '-mode';
        
        // Update model indicator
        document.querySelector('.model-indicator').textContent = 
            mode === 'alien' ? 'ALIEN AI' : 
            mode === 'einstein' ? 'EINSTEIN AI' : 'NEWTON AI';
        
        // Update mode button active state
        const modeButtons = document.querySelectorAll('.mode-button');
        modeButtons.forEach(button => {
            if (button.dataset.mode === mode) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // For Einstein mode, trigger the muscular Einstein animation and play music
        if (mode === 'einstein') {
            // First reset any existing transition state
            document.body.classList.remove('einstein-mode-transition');
            
            // Force a reflow to ensure the class removal takes effect
            void document.body.offsetWidth;
            
            // Add the transition class to trigger animation
            document.body.classList.add('einstein-mode-transition');
            
            // Display a random funny quote in the speech bubble
            const funnyEinsteinQuotes = [
                "E=mc² of coolness!",
                "Relativity rocks!",
                "Physics is lit!",
                "Imagination > Knowledge!",
                "Let's bend spacetime!",
                "I'm relatively awesome!",
                "Quantum leaping in!",
                "Time is relative to fun!"
            ];
            
            const randomQuote = funnyEinsteinQuotes[Math.floor(Math.random() * funnyEinsteinQuotes.length)];
            const speechBubble = document.querySelector('.einstein-speech-bubble');
            if (speechBubble) {
                speechBubble.innerText = randomQuote;
            }
            
            // Create a more recognizable Einstein
            createEinsteinImage();
            
            // Create stars
            createStars();
            
            // Create floating equations
            createFloatingEquations();
            
            // Remove the transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove('einstein-mode-transition');
                clearStars();
                clearFloatingEquations();
            }, 3500);
        }
        // For Newton mode, trigger the muscular Newton animation and play music
        else if (mode === 'newton') {
            // First reset any existing transition state
            document.body.classList.remove('newton-mode-transition');
            
            // Force a reflow to ensure the class removal takes effect
            void document.body.offsetWidth;
            
            // Add the transition class to trigger animation
            document.body.classList.add('newton-mode-transition');
            
            // Display a random funny quote in the speech bubble
            const funnyNewtonQuotes = [
                "Gravity is my game!",
                "I've got the force!",
                "Apple a day!",
                "Laws of motion rule!",
                "F=ma is the way!",
                "What goes up must come down!",
                "Action = Reaction!",
                "Gravity never takes a day off!"
            ];
            
            const randomQuote = funnyNewtonQuotes[Math.floor(Math.random() * funnyNewtonQuotes.length)];
            const speechBubble = document.querySelector('.newton-speech-bubble');
            if (speechBubble) {
                speechBubble.innerText = randomQuote;
            }
            
            // Create a more recognizable Newton
            createNewtonImage();
            
            // Create stars
            createNewtonStars();
            
            // Create falling apple animation
            createFallingApple();
            
            // Remove the transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove('newton-mode-transition');
                clearNewtonStars();
            }, 3500);
        }
        
        // Clear messages when switching modes
        document.getElementById('chat-messages').innerHTML = '';
        
        // Display welcome message for the new mode
        displayWelcomeMessage();
    }
    
    // Function to create stars for Einstein mode transition
    function createStars() {
        const starsContainer = document.getElementById('einstein-stars');
        if (!starsContainer) return;
        
        // Clear any existing stars
        starsContainer.innerHTML = '';
        
        // Create 50 stars with random positions, sizes, and twinkle animations
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random size between 2px and 6px
            const size = Math.floor(Math.random() * 4) + 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random twinkle animation delay
            star.style.animation = `twinkle ${(Math.random() * 0.5) + 0.5}s infinite alternate`;
            star.style.animationDelay = `${Math.random() * 1}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    // Function to clear stars
    function clearStars() {
        const starsContainer = document.getElementById('einstein-stars');
        if (starsContainer) {
            starsContainer.innerHTML = '';
        }
    }
    
    // Add keyframe for star twinkling animation
    const twinkleStyle = document.createElement('style');
    twinkleStyle.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(46, 204, 113, 0.8)); }
        }
    `;
    document.head.appendChild(twinkleStyle);
    
    // Terminal sound effects
    const scannerSound = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vm//Gb//3Nkj//Xt//+//3////+// //dzWkAAABlElEQVQ4y52XW3aDMAxEdyLv5WW8lp2khZhYskYzI/Wnv8LlYWt0Zcc+PsdbAyQpYwr/BkkQYwgpWDy7A/Y/Q+YKHaF9Zhk0JaA9PwNSldQDYATkfOxkt/SQswZod0CysunO3j3wok/gBzDrYZsNuBUQb6HO+Cp4sIJ90y+g63RIxoD8GGK7cgHpp8OcAnkL2X/PF5BP4NoAfQ3k7Pg5gLoEtvMnkMue5hdA2sFnAFPl5EvgrSL5J2Cs/GQF9FVKP4G0BfISSIdlrgFc9pS/gWUPz1dA2S8pA9Ihmc+XQDk0eQz0Q7OfwFr2xEh27uJbCz9bQT4s4w3gXNjuAZx+NFIC5Z7t9wTmK30JKBUeZAPlwQyVQH5gk1GgHNz6CNTDm1uqzPrNDdBszRbULvZaEpn9lg5otg5GtLZvRYF6Y9cEarvSTp52o14C8dYuDlR3dXMJeFt3TaC4v60GXD1CR4DLx66nPnx3B7h9/tsAsX8mOwKNv9u6A8z+9dkdwPm/gP8Abz75ezldQPoAAAAASUVORK5CYII=');
    scannerSound.volume = 0.1;
    
    const keyPressSound = new Audio('data:audio/wav;base64,UklGRl4BAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToBAACBgIF/gn2Cf4B/gn+AfwEAAoACgQF/An4Dfb0A2/8zAAsA3f8SAPH/2QDX/+sAwwD7/93/5QD9/8gA9f/s/wMA7/8EAB0Awf8PAOz/RADw/xAAuv9VANT/EADD/zwA+P/y/wgAFQAjAEsAIgAJAD4A6P8aAMX/NgDu//P/EgABAC0AHgATAAkAHwACABAA/v82AN//NgC8/yMA6f/+/zoAyv9JALL/RgDI/y0A7//4/0kAFgD4/zUA/v/1/zEAAQACAEYAyv9hALj/TACw/zEA9P/z/0oA9/8rABEA9P8RAPL/FQAvAPD/SwDV/0IAy/8kAO//9f9HAPP/OwD0//v/EAD//woAKgDv/1MA7P8eAOT/AAD5//b/KQDw/ywA9f/0/w0ABQD+/w==');
    keyPressSound.volume = 0.02;

    // Add event listeners
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        keyPressSound.currentTime = 0;
        keyPressSound.play().catch(e => console.log("Audio play failed:", e));
    });

    // Focus input on page load
    setTimeout(() => {
        userInput.focus();
    }, 500);

    // Remove this duplicate auto-resize event listener since we've combined it with language detection
    // userInput.addEventListener('input', () => {
    //     userInput.style.height = 'auto';
    //     userInput.style.height = (userInput.scrollHeight < 200) ? 
    //         userInput.scrollHeight + 'px' : '200px';
    // });

    // Animate the scanline effect
    function animateScannerEffect() {
        scannerSound.currentTime = 0;
        scannerSound.play().catch(e => console.log("Audio play failed:", e));
        
        const randomLine = document.createElement('div');
        randomLine.style.position = 'absolute';
        randomLine.style.height = '1px';
        randomLine.style.width = '100%';
        randomLine.style.backgroundColor = 'var(--primary-color)';
        randomLine.style.opacity = '0.7';
        randomLine.style.zIndex = '10';
        randomLine.style.left = '0';
        randomLine.style.top = Math.floor(Math.random() * window.innerHeight) + 'px';
        randomLine.style.transition = 'opacity 1s';
        
        document.body.appendChild(randomLine);
        
        setTimeout(() => {
            randomLine.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(randomLine);
            }, 1000);
        }, 300);
    }
    
    // Random scanner effect
    setInterval(() => {
        if (Math.random() < 0.3) {
            animateScannerEffect();
        }
    }, 5000);

    // Add subtle animation to the background glow
    const chatContainer = document.querySelector('.chat-container');
    const glow = document.querySelector('.glow');
    
    document.addEventListener('mousemove', (e) => {
        if (chatContainer) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            chatContainer.style.setProperty('--mouse-x', x);
            chatContainer.style.setProperty('--mouse-y', y);
            
            if (glow) {
                glow.style.left = `${e.clientX}px`;
                glow.style.top = `${e.clientY}px`;
            }
        }
    });

    // Simplify welcome messages to a single greeting
    function displayWelcomeMessage() {
        if (currentMode === 'alien') {
        // Display alien art
        const alienArt = `█████████████████████████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█████████████████████████████████████
██████████████████████████████████▓▒▒▒▒▒▒████████████████████████▓▒▒▒▒▒▒███████████████████████████████
██████████████████████████████▒▒▒▒▒████████████████████████████████████▓▒▒▒▒█████████████████████████
███████████████████████████▒▒▒▒█████████████████████████████████████████▒▒▒▓███████████████████████
████████████████████████▒▒▒▓████████▒▒████▓▓▓▓█▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓████▒▒▓████████▒▒▒█████████████████████
██████████████████████▒▒▒████████▒▒▒██▓▓▓▓▓▒█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓██▓▒▒████████▓▒▒▓██████████████████
████████████████████▒▒▓████████▓▒▒██▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▓▒▓▓▓█▒▒▒█████████▒▒▓████████████████
██████████████████▒▒▒███████▓█▒▒▒█▓▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█▓▒▒█▓████████▒▒▒█████████████
█████████████████▒▒███████▓▓█▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓█▒▒█▓▓▓██████▒▒▒█████████████
███████████████▒▒▒██████▒▒▒▓▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒█▒▒▒▓█████▒▒███████████
██████████████▒▒▓█████▒▓▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▓▓▒▓▒▓█████▒▒███████████
█████████████▒▒█████▓▒▒▒▒▒█▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▒▒▒▒█████▒▒██████████
████████████▒▒█████▓▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▓█████▒▒█████████
███████████▓▒▓████▓▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒█████▒▒█████████
███████████▒▒████▓▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▓████▒▒█████████
██████████▒▒█████▒▒▒▒▒▒█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▓████▒▒███████
██████████▒▒████▓▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▓▒▒▒▒▒▒▓████▒▓██████
█████████▒▒████▓▒▒▒▒▒▒█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▓▓███▒▒██████
█████████▒▒████▓▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█▓▒▒▒▒▓▓████▒▓█████
█████████▒████▓▓▒▒▒▒▓█▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▓▓████▒▒█████
████████▓▒████▓▓▒▒▒▒██▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▒▒▒▓▓████▒▒█████
████████▒▒████▓▓▒▒▒▓██▒▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒██▒▒▒▓▓████▒▒█████
████████▒▒████▓▓▒▒▓██▒▒▒▒▒▒█▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒██▓▒▒▓▓████▒▒█████
████████▓▒████▓▓▓▓███▒▒▒▒▒▒█▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓█▒▒▒▒▒▒▓██▓▓▓▓████▒▒█████
█████████▒████▓▓▓███▒▒▒▒▒▒▒▒██▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓█▒▒▒▒▒▒▒▒▓███▓▓████▒▒█████
█████████▒▒████████▒▒▒▒▒▒▒▒▒▓███▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓██▒▓▒▒▒▒▒▒▒▒▒███▓████▒▓█████
█████████▒▒██████▒▒▒▒▒▒▒▒▒▒▒▒▒▓███▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒██████▒▒██████
█████████▒▒█████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█████▒▒██████
█████████▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓████▒▒█████
████████▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▓████
███████▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓███▒▒████
███████▒▒████▒▒▒▓▓▓████████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████▓▓█▓▒▒▒███▒▒████
███████▓▒████▒▒▓▓▓▓███▒▒▒██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▓▓▒▒▒▒▒▒▒▒▒▒▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒███████▒▒▒██▓▓▓▓▓▒▓███▒▒████
████████▒▒███▓▒▓▓▓▓▓██▓▓▓██▒▒▓████▒▒▒▒▒▒▒▒▒▒▒▒█▓▓▒▒▒▒▒▒▒▒▓▓█▒▒▒▒▒▒▒▒▒▒▒▒█████▒▒▓██▓▓███▒▓▓▓▓▒███▒▒█████
█████████▒▒███▓▓▓▓▓▓████████▒▒▒▒████▒▒▒▒▒▒▒▒▒▒▒█▓▓▒▒▒▒▒▒▒▓█▒▒▒▒▒▒▒▒▒▒▒████▒▒▒▒█████████▓▓▓▓▒████▒▒█████
██████████▒▒████▓▓▓▒██████████▒▒▒▒▒███▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒████▒▒▒▒██████████▓▓▓▓▓███▓▒▒██████
███████████▒▒████▓▓▒▓███████████▒▒▒▒▒███▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒███▓▒▒▒▒████████████▒▓▓████▒▒████████
████████████▒▒▓███▓▓▒██████████████▒▒▒▒██▓▒▒▒▒▒▒▒▒▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒███▒▒▒██████████████▓▓▓████▒▒█████████
█████████████▓▒▒███▓▓▒███████████████▓▒▒███▒▒▒▒▒▒▒▒▓▓▓▓▓▒▒▒▒▒▒▒▓██▒▒▒████████████████▒▓████▒▒██████████
████████████████▒▒███▓▒▒█████████████████▒▓██▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒███▒▒█████████████████▒▓███▓▒▒███████████
████████████████▒▒████▓▓▒██████████████████▒██▒▒▒▒▒▓▓▓▓▓▒▒▒▒██▒██████████████████▒▓▓▓███▒▒████████████
████████████████▒▒███▓▒▓▓▓▒██████▓▒████████████▒▒▒▒▓▓▓▓▓▒▒▒████████████▓▒██████▒▒▓▓▒▒████▒▒████████████
███████████████▒▒████▒▒▒▓▓▓▓▒▒█████▓▒▒▒▒▒▒██████▒▒▒█▓▓▓▒▒▒▒█████▓▒▒▒▒▒▒█████▓▒▓▓▓▓▒▒▒████▒▒████████████
███████████████▒▒████▒▒▒▒▒▓▓▓▓▓▓▓████████████▓▓█▒▒▒█▒▒▓▒▒▒█▓▓▓███████████▓▓▓▓▓▓▓█▒▒▒▒▓███▒▒████████████
███████████████▒▒████▒▒▒▒▒▒▒███▓▓▓▓▓▓████▓▒▒▒▒▓▒▒▒█▒▒▒▒█▒▒▒▓▒▒▒▒▒████▓▓▓▓▓▓▓██▒▒▒▒▒▒▒████▒▒████████████
████████████████▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒████████████
████████████████▒▒█████▒▒▒▒▒▒▒▒▒▒▒▒▒▓██████▒▒▒▒▒▓██▒▒▒▒██▓▓▒▒▒▒██████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒█████████████
█████████████████▒▒▓█████▒▒▒▒▒▒▒███████▓▓▓█▓█▒▒▒██▓▒▒▒▒▒██▒▒▒▒▓██▓▓███████▒▒▒▒▒▒▒██████▒▒██████████████
███████████████████▒▒▒█████████████▓▓▓▓██▓▓█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓██▓▓▓▓▓▓▓████████████▒▒▒██████████████
█████████████████████▒▒▒▒▒▓███████▓▓▓█▓▓▓█▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▓▓█▓▓▓▓▓▓▓▓▓███████▓▒▒▒▒▒██████████████████
███████████████████████████▓▒▒▓█████▓▓██▓█▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓█▓▓▓▓▓▓▓█████▒▒▒▓███████████████████████
██████████████████████████████▒▒██████▓█▓▓▓▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▓▓█▓▓▓████▒▒▓██████████████████████████
███████████████████████████████▓▒▒████▓█▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓█▓████▓▒▒████████████████████████████
█████████████████████████████████▒▒█████▓▓▒▒▒▒▒████████████▒▒▒▒▒▒▒█████▒▒██████████████████████████████
██████████████████████████████████▒▒████▓▒▒▒██▓▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒████▒▒████████████████████████████
███████████████████████████████████▒▒████▒▒▒▒▒▒▒▓▓██████▓▓▒▒▒▒▒▒▒▓███▒▒████████████████████████████████
████████████████████████████████████▒▒████▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▓███▒▒████████████████████████████████
█████████████████████████████████████▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒▓████████████████████████████████
██████████████████████████████████████▒▒████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒▓████████████████████████████
███████████████████████████████████████▒▒▒██████▒▒▒▒▓▓▓▒▒▒▓██████▒▒████████████████████████████████
█████████████████████████████████████████▒▒▒██████████████████▓▒▒▓████████████████████████████████████████
███████████████████████████████████████████▒▒▒▒▒▓█████████▒▒▒▒▒████████████████████████████████████
████████████████████████████████████████████████▓▒▒▒▒▒▒▒▒▓█████████████████████████████████████████████████`;
        
        // Add the ASCII art
        addMessage(alienArt, 'ai');
        
        // Add just a single welcome message after a short delay
        setTimeout(() => {
                const welcomeMessage = "WELCOME TO ALIEN AI. I AM YOUR ADVANCED EXTRATERRESTRIAL INTELLIGENCE ASSISTANT. WHAT KNOWLEDGE DO YOU SEEK FROM THE STARS?";
                addMessage(welcomeMessage, 'ai');
            }, 500);
        } else if (currentMode === 'einstein') {
            // Einstein Mode welcome message
