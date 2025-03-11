document.addEventListener('DOMContentLoaded', () => {
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
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
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
        // Display alien art
        const alienArt = `█████████████████████████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█████████████████████████████████████
██████████████████████████████████▓▒▒▒▒▒▒████████████████████████▓▒▒▒▒▒▒███████████████████████████████
██████████████████████████████▒▒▒▒▒████████████████████████████████████▓▒▒▒▒█████████████████████████
███████████████████████████▒▒▒▒█████████████████████████████████████████▒▒▒▓███████████████████████
████████████████████████▒▒▒▓████████▒▒████▓▓▓▓█▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓████▒▒▓████████▒▒▒█████████████████████
██████████████████████▒▒▒████████▒▒▒██▓▓▓▓▓▒█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓██▓▒▒████████▓▒▒▓██████████████████
████████████████████▒▒▓████████▓▒▒██▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▓▒▓▓▓█▒▒▒█████████▒▒▓████████████████
██████████████████▒▒▒███████▓█▒▒▒█▓▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█▓▒▒█▓████████▒▒▒█████████████
█████████████████▒▒███████▓▓█▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓█▒▒█▓▓▓██████▒▒▒█████████████
███████████████▒▒▒██████▒▒▒▓▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒█▒▒▒▓█████▒▒███████████
██████████████▒▒▓█████▒▓▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▓▓▒▓▒▓█████▒▒███████████
█████████████▒▒█████▓▒▒▒▒▒█▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▒▒▒▒█████▒▒██████████
████████████▒▒█████▓▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▓█████▒▒█████████
███████████▓▒▓████▓▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒█████▒▒█████████
███████████▒▒████▓▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▓████▒▒█████████
██████████▒▒█████▒▒▒▒▒▒█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▓████▒▒███████
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
█████████▒▒█████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█████▒▒██████
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
            addMessage("HELLO HUMAN. I AM ALIEN AI, CREATED BY ALI FROM THE DISTANT PLANET XENO-7. WHAT INFORMATION DO YOU SEEK FROM ME?", 'ai');
        }, 500);
    }

    // Add language switching functionality
    let currentLanguage = 'en';

    function switchLanguage(lang) {
        // Don't switch if already in that language
        if (currentLanguage === lang) return;
        
        // Store previous language for notification
        const previousLanguage = currentLanguage;
        
        // Update the language
        currentLanguage = lang;
        document.documentElement.lang = lang;
        
        if (lang === 'ar') {
            document.body.setAttribute('dir', 'rtl');
            document.querySelector('#user-input').setAttribute('placeholder', 'أدخل استفسارك...');
            document.querySelector('.send-button').innerHTML = '<i class="fas fa-paper-plane"></i>';
            document.querySelector('.model-indicator').textContent = 'الذكاء الفضائي';
        } else {
            document.body.removeAttribute('dir');
            document.querySelector('#user-input').setAttribute('placeholder', 'ENTER QUERY...');
            document.querySelector('.send-button').innerHTML = '<i class="fas fa-paper-plane"></i>';
            document.querySelector('.model-indicator').textContent = 'ALIEN AI';
        }
        
        // Update existing messages direction
        document.querySelectorAll('.message').forEach(msg => {
            if (lang === 'ar') {
                msg.setAttribute('dir', 'rtl');
            } else {
                msg.removeAttribute('dir');
            }
        });
        
        // Add subtle notification about language change if auto-detected (remove any existing notification first)
        const existingNotification = document.querySelector('.language-notification');
        if (existingNotification) {
            document.body.removeChild(existingNotification);
        }
        
        if (previousLanguage) {
            // Create a notification element
            const notification = document.createElement('div');
            notification.className = 'language-notification';
            notification.textContent = lang === 'ar' 
                ? 'تم تغيير اللغة إلى العربية تلقائيًا' 
                : 'Language automatically switched to English';
            
            // Set positioning based on language
            if (lang === 'ar') {
                notification.style.left = 'auto';
                notification.style.right = '20px';
            } else {
                notification.style.right = 'auto';
                notification.style.left = '20px';
            }
            
            // Add to document
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        if (notification.parentNode) {
                            document.body.removeChild(notification);
                        }
                    }, 300);
                }
            }, 3000);
        }
    }

    // Function to handle sending messages
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Check if message contains Arabic
        if (containsArabic(message) && currentLanguage !== 'ar') {
            // Switch to Arabic mode
            switchLanguage('ar');
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'language-notification';
            notification.setAttribute('dir', 'rtl');
            notification.setAttribute('lang', 'ar');
            notification.textContent = 'تم التبديل إلى وضع اللغة العربية';
            document.body.appendChild(notification);
            
            // Remove after a delay
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
            
            // Process message after a short delay to allow UI to update
            setTimeout(() => {
                processUserMessage(message).catch(error => {
                    console.error('Error in processUserMessage:', error);
                });
            }, 500);
        } else if (currentLanguage === 'ar' && !containsArabic(message)) {
            // Switch back to English for non-Arabic text
            switchLanguage('en');
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'language-notification';
            notification.textContent = 'Switched to English mode';
            document.body.appendChild(notification);
            
            // Remove after a delay
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
            
            // Process message after a short delay
            setTimeout(() => {
                processUserMessage(message).catch(error => {
                    console.error('Error in processUserMessage:', error);
                });
            }, 500);
        } else {
            // Process message normally
            processUserMessage(message).catch(error => {
                console.error('Error in processUserMessage:', error);
            });
        }
    }

    // Helper function to actually process the message after language detection
    async function processUserMessage(message) {
        // Check if the user is asking to change the API key
        if (message.toLowerCase().includes('api key') || 
            message.toLowerCase().includes('apikey') || 
            message.toLowerCase().includes('change api') || 
            message.toLowerCase().includes('update api') || 
            message.toLowerCase().includes('api change') || 
            message.toLowerCase().includes('change my api') || 
            message.toLowerCase().includes('want to change my api') || 
            message.toLowerCase().includes('update my api') ||
            message.toLowerCase().includes('set api') ||
            message.toLowerCase().includes('new api') ||
            (currentLanguage === 'ar' && message.includes('مفتاح') && message.includes('api'))) {
            
            addMessage(message, 'user');
            document.getElementById('user-input').value = '';
            changeApiKey();
            return;
        }
        
        // Regular message handling
        addMessage(message, 'user');
        
        // Clear the input
        document.getElementById('user-input').value = '';
        userInput.style.height = 'auto';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
        
        try {
            // First check the knowledge base for relevant information
            console.log('Checking knowledge base for: ', message);
            const knowledgeResult = await knowledgeBase.search(message);
            
            if (knowledgeResult) {
                // Knowledge base has relevant information - use it
                console.log('Using knowledge base for response');
                setTimeout(() => {
                    // Remove typing indicator
                    chatMessages.removeChild(typingIndicator);
                    
                    // Generate and display response from knowledge base
                    const response = knowledgeBase.generateResponse(knowledgeResult);
                    typeMessageRealtime(response, 'ai', true); // true indicates it's from knowledge base
                }, 1000); // Small delay to simulate processing time
            } else {
                // No relevant info in knowledge base - fall back to AI API
                console.log('Falling back to general AI knowledge');
                
                // Send the message to the API and handle the response
                sendToOpenRouter(message)
                    .then(response => {
                        // Remove typing indicator
                        chatMessages.removeChild(typingIndicator);
                        
                        // Display the AI's response with the typing effect
                        typeMessageRealtime(response, 'ai');
                    })
                    .catch(error => {
                        // Remove typing indicator
                        if (typingIndicator.parentNode) {
                            chatMessages.removeChild(typingIndicator);
                        }
                        
                        // Show error message
                        const errorMsg = currentLanguage === 'ar' 
                            ? 'حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من مفتاح API الخاص بك والاتصال بالإنترنت.' 
                            : 'Error connecting to the server. Please check your API key and internet connection.';
                        
                        addMessage(errorMsg, 'ai');
                        console.error('API Error:', error);
                    });
            }
        } catch (error) {
            console.error('Error processing message:', error);
            // Remove typing indicator
            if (typingIndicator.parentNode) {
                chatMessages.removeChild(typingIndicator);
            }
            
            // Show error message
            const errorMsg = 'Error processing your request. Please try again.';
            addMessage(errorMsg, 'ai');
        }
    }

    // Function to add a message to the chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // Special handling for ASCII art
        if (sender === 'ai' && text.includes('█████████')) {
            // For ASCII art, wrap in a pre tag to preserve formatting
            const preElement = document.createElement('pre');
            preElement.className = 'ascii-art';
            preElement.textContent = text;
            messageDiv.appendChild(preElement);
        } else {
            // Normal message formatting
            messageDiv.innerHTML = sender === 'ai' ? formatText(text) : text;
            
            // Apply syntax highlighting to code blocks
            if (sender === 'ai') {
                highlightCodeBlocks(messageDiv);
            }
        }
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        
        // Add direction attribute based on current language
        if (currentLanguage === 'ar') {
            messageDiv.setAttribute('dir', 'rtl');
            messageDiv.setAttribute('lang', 'ar');
        }
        
        return messageDiv;
    }

    // Function to type out a message in real-time with dramatic effects
    function typeMessageRealtime(text, sender, fromKnowledgeBase = false) {
        // Process text with Markdown if it's from AI
        let processedText = text;
        if (sender === 'ai') {
            // Check for code blocks first
            const hasCodeBlocks = text.includes('```');
            
            if (hasCodeBlocks) {
                // For messages with code blocks, format and display differently
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${sender}-message`;
                
                // Add knowledge base class if applicable
                if (fromKnowledgeBase) {
                    messageDiv.classList.add('from-knowledge-base');
                }
                
                // Set RTL direction for Arabic
                if (currentLanguage === 'ar') {
                    messageDiv.setAttribute('dir', 'rtl');
                    messageDiv.setAttribute('lang', 'ar');
                }
                
                // Add the source indicator for knowledge base responses
                if (fromKnowledgeBase) {
                    const sourceIndicator = document.createElement('div');
                    sourceIndicator.className = 'knowledge-source-indicator';
                    sourceIndicator.innerHTML = '<span class="kb-icon">📚</span> Response from custom knowledge base';
                    messageDiv.appendChild(sourceIndicator);
                }
                
                // Format and display immediately but with a dramatic fade-in animation
                const formattedText = formatText(text);
                messageDiv.innerHTML = formattedText;
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'scale(0.95) translateY(20px)';
                messageDiv.style.filter = 'blur(10px)';
                
                chatMessages.appendChild(messageDiv);
                
                // Process and highlight code blocks
                highlightCodeBlocks(messageDiv);
                
                // Make sure code blocks are always LTR
                const codeBlocks = messageDiv.querySelectorAll('pre, code');
                codeBlocks.forEach(block => {
                    block.setAttribute('dir', 'ltr');
                });
                
                // Add dramatic entrance animation
                setTimeout(() => {
                    messageDiv.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
                    messageDiv.style.opacity = '1';
                    messageDiv.style.transform = 'scale(1) translateY(0)';
                    messageDiv.style.filter = 'blur(0)';
                    
                    // Add glitch effect to the entire message
                    messageDiv.style.animation = 'glitchText 0.3s ease';
                    
                    // Apply alien glow to various elements
                    const headings = messageDiv.querySelectorAll('h1, h2, h3, h4');
                    headings.forEach(heading => {
                        heading.classList.add('alien-highlight');
                        heading.setAttribute('data-text', heading.textContent);
                    });
                    
                    // Mark as complete after animation
                    setTimeout(() => {
                        messageDiv.classList.add('complete');
                        scannerSound.currentTime = 0;
                        scannerSound.play().catch(e => console.log("Audio play failed:", e));
                    }, 800);
                }, 100);
                
                scrollToBottom();
                return;
            }
        }
        
        // Create message container with dramatic entrance
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // Add knowledge base class if applicable
        if (sender === 'ai' && fromKnowledgeBase) {
            messageDiv.classList.add('from-knowledge-base');
        }
        
        // Set RTL direction for Arabic
        if (currentLanguage === 'ar') {
            messageDiv.setAttribute('dir', 'rtl');
            messageDiv.setAttribute('lang', 'ar');
        }
        
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'scale(0.95) translateY(20px)';
        chatMessages.appendChild(messageDiv);
        
        // Add the source indicator for knowledge base responses (for AI only)
        if (sender === 'ai' && fromKnowledgeBase) {
            const sourceIndicator = document.createElement('div');
            sourceIndicator.className = 'knowledge-source-indicator';
            sourceIndicator.innerHTML = '<span class="kb-icon">📚</span> Response from custom knowledge base';
            messageDiv.appendChild(sourceIndicator);
        }
        
        // Add dramatic entrance animation
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'scale(1) translateY(0)';
        }, 50);

        // For AI responses, bring back real-time typing with improved formatting
        if (sender === 'ai') {
            // Pre-process the text with Markdown
            const formattedText = formatText(text);
            
            // Create a temporary div to hold the formatted HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formattedText;
            
            // Extract the text nodes and element structure
            const textNodes = [];
            
            function extractTextNodes(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // This is a text node
                    if (node.textContent.trim() !== '') {
                        textNodes.push({
                            text: node.textContent,
                            parentTag: node.parentNode.tagName.toLowerCase(),
                            node: node
                        });
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Skip pre/code blocks - we'll insert them whole
                    if (node.tagName === 'PRE') {
                        textNodes.push({
                            element: node.cloneNode(true),
                            isBlock: true
                        });
                        return;
                    }
                    
                    // Process other nodes
                    Array.from(node.childNodes).forEach(child => {
                        extractTextNodes(child);
                    });
                }
            }
            
            // Extract text nodes from formatted content
            Array.from(tempDiv.childNodes).forEach(node => {
                extractTextNodes(node);
            });
            
            // Recreate the structure with empty elements
            const contentContainer = document.createElement('div');
            contentContainer.className = 'alien-text';
            
            // Set RTL direction for Arabic content container
            if (currentLanguage === 'ar') {
                contentContainer.setAttribute('dir', 'rtl');
                contentContainer.setAttribute('lang', 'ar');
            }
            
            messageDiv.appendChild(contentContainer);

            // Typing state
            let currentIndex = 0;
            let charIndex = 0;
            let currentElement = null;
            let currentElementType = null;
            
            // Function to type the next character
            const typeNext = () => {
                if (currentIndex >= textNodes.length) {
                    // We're done typing
                    messageDiv.classList.add('complete');
                    scannerSound.currentTime = 0;
                    scannerSound.play().catch(e => console.log("Audio play failed:", e));
                    
                    // Make sure to scroll to the bottom to show the complete message
                    setTimeout(scrollToBottom, 100);
                    return;
                }
                
                const currentNode = textNodes[currentIndex];
                
                // If this is a block element (like a code block), insert it completely
                if (currentNode.isBlock) {
                    contentContainer.appendChild(currentNode.element.cloneNode(true));
                    
                    // Add special effects for code blocks
                    const codeBlocks = currentNode.element.querySelectorAll('pre');
                    if (codeBlocks.length > 0) {
                        highlightCodeBlocks(contentContainer);
                        
                        // Make sure code blocks are always LTR
                        const allCodeElements = contentContainer.querySelectorAll('pre, code');
                        allCodeElements.forEach(block => {
                            block.setAttribute('dir', 'ltr');
                        });
                    }
                    
                    // Move to next node
                    currentIndex++;
                    charIndex = 0;
                    currentElement = null;
                    
                    // Play scanner sound
                    scannerSound.currentTime = 0;
                    scannerSound.play().catch(e => console.log("Audio play failed:", e));
                    
                    // Make sure current content is visible
                    scrollToBottom();
                    
                    // Add a pause after code blocks
                    setTimeout(typeNext, 500);
                    return;
                }
                
                // If starting a new text node
                if (charIndex === 0) {
                    // Create the parent element if needed
                    if (currentNode.parentTag !== currentElementType) {
                        currentElementType = currentNode.parentTag;
                        
                        // Create the appropriate element
                        if (currentElementType === 'body' || currentElementType === 'div') {
                            currentElement = document.createElement('p');
                        } else {
                            currentElement = document.createElement(currentElementType);
                        }
                        
                        // Add special styling for headings
                        if (['h1', 'h2', 'h3', 'h4'].includes(currentElementType)) {
                            currentElement.classList.add('alien-highlight');
                            // We'll set data-text when finished with this element
                        }
                        
                        contentContainer.appendChild(currentElement);
                    }
                }
                
                // Get current text node and current character
                const textContent = currentNode.text;
                
                // If we've reached the end of this text node
                if (charIndex >= textContent.length) {
                    // Finalize styling for headings
                    if (['h1', 'h2', 'h3', 'h4'].includes(currentElementType)) {
                        currentElement.setAttribute('data-text', currentElement.textContent);
                    }
                    
                    // Move to the next text node
                    currentIndex++;
                    charIndex = 0;
                    
                    // If we're moving to a new element, reset currentElement
                    if (currentIndex < textNodes.length && 
                        textNodes[currentIndex].parentTag !== currentElementType) {
                        currentElement = null;
                        currentElementType = null;
                    }
                    
                    // Small pause between text nodes
                    setTimeout(typeNext, Math.random() * 100 + 50);
                    return;
                }
                
                // Get the next character
                const char = textContent[charIndex];
                
                // Create a span for special characters or just add the character
                if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(char) && Math.random() < 0.3) {
                    const span = document.createElement('span');
                    span.className = 'alien-char';
                    span.textContent = char;
                    currentElement.appendChild(span);
                } else {
                    currentElement.appendChild(document.createTextNode(char));
                }
                
                // Play typing sound occasionally
                if (Math.random() < 0.1) {
                    keyPressSound.currentTime = 0;
                    keyPressSound.playbackRate = 0.8 + Math.random() * 0.4;
                    keyPressSound.play().catch(e => console.log("Audio play failed:", e));
                }
                
                // Increment character index
                charIndex++;
                
                // Determine the delay for the next character
                let nextDelay;
                
                // Vary typing speed
                if (char === '.' || char === '!' || char === '?' || char === ',') {
                    nextDelay = Math.random() * 150 + 100; // Longer pause at punctuation
                } else if (Math.random() < 0.05) {
                    nextDelay = Math.random() * 100 + 50; // Occasional random pause
                } else {
                    nextDelay = Math.random() * 15 + 10; // Normal typing speed
                }
                
                // Schedule the next character
                setTimeout(typeNext, nextDelay);
                
                // Scroll to bottom with each new character
                scrollToBottom();
            };
            
            // Start typing after a small delay
            setTimeout(typeNext, 100);
        } else {
            // For user messages, handle differently
            // Split text into words for display
            const words = text.split(' ');
            let wordIndex = 0;
            
            const showNextWord = () => {
                if (wordIndex >= words.length) {
                    messageDiv.classList.add('complete');
                    return;
                }
                
                const wordSpan = document.createElement('span');
                wordSpan.textContent = words[wordIndex] + (wordIndex < words.length - 1 ? ' ' : '');
                wordSpan.style.opacity = '0';
                wordSpan.style.transform = 'translateY(10px)';
                messageDiv.appendChild(wordSpan);
                
                setTimeout(() => {
                    wordSpan.style.transition = 'all 0.2s ease-out';
                    wordSpan.style.opacity = '1';
                    wordSpan.style.transform = 'translateY(0)';
                }, 10);
                
                wordIndex++;
                setTimeout(showNextWord, 50);
            }
            
            showNextWord();
        }
        
        scrollToBottom();
    }

    // Function to format text with Markdown and special formatting
    function formatText(text) {
        // First escape any HTML to prevent injection
        let safeText = escapeHtml(text);
        
        // Format code blocks (must be done first to avoid conflicts)
        safeText = formatCodeBlocks(safeText);
        
        // Process Markdown elements
        
        // Headers (h1, h2, h3, h4)
        safeText = safeText.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
        safeText = safeText.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        safeText = safeText.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        safeText = safeText.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
        
        // Bold and italic
        safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        safeText = safeText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Lists
        safeText = safeText.replace(/^\s*\*\s+(.*?)$/gm, '<li>$1</li>');
        safeText = safeText.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li>$1</li>');
        safeText = safeText.replace(/(<li>.*?<\/li>\n)+/g, function(match) {
            return '<ul>' + match.replace(/\n$/, '') + '</ul>';
        });
        
        // Links
        safeText = safeText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Horizontal rules
        safeText = safeText.replace(/^---$/gm, '<hr>');
        
        // Blockquotes
        safeText = safeText.replace(/^>\s+(.*?)$/gm, '<blockquote>$1</blockquote>');
        
        // Inline code (after code blocks have been processed)
        safeText = safeText.replace(/`([^`]+?)`/g, '<code>$1</code>');
        
        // Convert line breaks to paragraphs
        safeText = '<p>' + safeText.replace(/\n\n+/g, '</p><p>') + '</p>';
        
        // Clean up empty paragraphs
        safeText = safeText.replace(/<p>\s*<\/p>/g, '');
        
        // Fix conflict with code blocks
        safeText = safeText.replace(/<p><pre>/g, '<pre>');
        safeText = safeText.replace(/<\/pre><\/p>/g, '</pre>');
        
        // Add RTL attributes to elements if in Arabic mode
        if (currentLanguage === 'ar') {
            // Add lang and dir attributes to block elements
            safeText = safeText.replace(/<(p|h1|h2|h3|h4|blockquote|ul|ol|li)>/g, '<$1 lang="ar" dir="rtl">');
            
            // Make sure code elements are always LTR
            safeText = safeText.replace(/<(pre|code)>/g, '<$1 dir="ltr">');
        }
        
        return safeText;
    }

    // Function to format code blocks with syntax highlighting
    function formatCodeBlocks(text) {
        return text.replace(/```([\w-]*)\n([\s\S]*?)\n```/g, function(match, language, code) {
            return `<pre><code class="language-${language}">${code}</code></pre>`;
        });
    }

    // Function to apply syntax highlighting to code blocks
    function highlightCodeBlocks(container = document) {
        container.querySelectorAll('pre code').forEach((block) => {
            const language = block.className.replace('language-', '');
            applyBasicHighlighting(block, language);
        });
    }

    // Simple function to add basic syntax highlighting classes
    function applyBasicHighlighting(block, language) {
        const code = block.innerHTML;
        
        // Add basic highlighting for common programming language elements
        let highlighted = code
            .replace(/(".*?")/g, '<span class="token string">$1</span>')
            .replace(/('.*?')/g, '<span class="token string">$1</span>')
            .replace(/\b(function|class|const|let|var|if|else|for|while|return|import|export|from|try|catch)\b/g, 
                '<span class="token keyword">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="token number">$1</span>')
            .replace(/(\/\/.*)/g, '<span class="token comment">$1</span>')
            .replace(/\/\*([\s\S]*?)\*\//g, '<span class="token comment">$&</span>');
        
        // Additional language-specific highlighting
        if (language === 'cpp' || language === 'c++' || language === 'c') {
            highlighted = highlighted
                .replace(/\b(int|float|double|char|bool|void|struct|class|template|typename|auto|namespace)\b/g, 
                    '<span class="token keyword">$1</span>')
                .replace(/\b(cout|cin|endl|printf|scanf)\b/g, 
                    '<span class="token function">$1</span>');
        } else if (language === 'python') {
            highlighted = highlighted
                .replace(/\b(def|import|from|as|with|in|is|not|and|or|None|True|False)\b/g, 
                    '<span class="token keyword">$1</span>')
                .replace(/\b(print|len|range|str|int|float|list|dict|set|tuple)\b/g, 
                    '<span class="token function">$1</span>');
        } else if (language === 'javascript' || language === 'js') {
            highlighted = highlighted
                .replace(/\b(async|await|this|typeof|instanceof|new|null|undefined|true|false)\b/g, 
                    '<span class="token keyword">$1</span>')
                .replace(/\b(console|document|window|Array|Object|String|Number|Boolean|Map|Set)\b/g, 
                    '<span class="token builtin">$1</span>')
                .replace(/\.(log|warn|error|info|debug|getElementById|querySelector)\b/g, 
                    '.<span class="token function">$1</span>');
        }
        
        block.innerHTML = highlighted;
    }

    // Function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Function to scroll the chat container to the bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to send message to OpenRouter API
    async function sendToOpenRouter(message) {
        try {
            const response = await fetch('/api/openrouter-proxy', {
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
                    max_tokens: 4096, // Increasing max tokens to handle longer responses
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
                let content = data.choices[0].message.content;
                
                // Log message length to help with debugging
                console.log(`Received message with ${content.length} characters`);
                
                return content;
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error('Error calling API:', error);
            throw error;
        }
    }
    
    // Function to show API key input prompt
    function showApiKeyPrompt() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'api-key-overlay';
        
        // Create prompt container
        const promptContainer = document.createElement('div');
        promptContainer.className = 'api-key-prompt';
        
        // Set RTL direction if language is Arabic
        if (currentLanguage === 'ar') {
            promptContainer.style.direction = 'rtl';
            promptContainer.setAttribute('lang', 'ar');
        }
        
        // Create the prompt content
        const title = document.createElement('h2');
        title.textContent = currentLanguage === 'ar' ? 'إشعار النظام' : 'System Notice';
        
        const description = document.createElement('p');
        description.innerHTML = currentLanguage === 'ar' 
            ? 'تم تكوين واجهة ALIEN AI لاستخدام مفتاح API على الخادم. لا تحتاج إلى مفتاح API الخاص بك للاستخدام.' 
            : 'The ALIEN AI interface is now configured to use a server-side API key. You no longer need your own API key to use it.';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const okButton = document.createElement('button');
        okButton.textContent = currentLanguage === 'ar' ? 'حسنًا' : 'OK';
        okButton.className = 'save-button';
        
        // Add event listener
        okButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            
            // Add confirmation message
            const confirmMessage = currentLanguage === 'ar' 
                ? 'تم تكوين النظام بنجاح. يمكنك متابعة استخدام ALIEN AI دون الحاجة إلى مفتاح API الخاص بك.' 
                : 'System configured successfully. You can continue using ALIEN AI without needing your own API key.';
            addMessage(confirmMessage, 'ai');
        });
        
        // Assemble the prompt
        buttonContainer.appendChild(okButton);
        
        promptContainer.appendChild(title);
        promptContainer.appendChild(description);
        promptContainer.appendChild(buttonContainer);
        
        overlay.appendChild(promptContainer);
        document.body.appendChild(overlay);
    }

    // Function to explicitly handle API key changes
    function changeApiKey() {
        // Display a message explaining server-side key is now used
        addMessage("API KEY CHANGE REQUEST DETECTED. THIS SYSTEM NOW USES A SERVER-SIDE API KEY. YOU DO NOT NEED TO PROVIDE YOUR OWN API KEY.", 'ai');
    }

    // Function to detect if text contains Arabic characters - improve with more comprehensive detection
    function containsArabic(text) {
        if (!text || text.trim().length === 0) return false;
        
        // Count Arabic characters
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
        const arabicMatches = text.match(arabicRegex);
        
        if (!arabicMatches) return false;
        
        // If more than 40% of the characters are Arabic, or if the first word is Arabic, consider it Arabic text
        const arabicCharCount = arabicMatches.length;
        const totalCharCount = text.replace(/\s/g, '').length;
        const arabicRatio = arabicCharCount / totalCharCount;
        
        const firstWord = text.trim().split(/\s+/)[0];
        const firstWordIsArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(firstWord);
        
        return arabicRatio > 0.4 || firstWordIsArabic;
    }

    // Remove API key change on click - only allow via chat commands
    // document.querySelector('.model-indicator').addEventListener('click', () => {
    //     changeApiKey();
    // });

    // Display welcome messages with typing animation
    displayWelcomeMessage();

    // Add input event listener to detect language in real-time while typing
    userInput.addEventListener('input', () => {
        // Auto-resize textarea
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight < 200) ? 
            userInput.scrollHeight + 'px' : '200px';
        
        // Detect language and set direction in real-time
        if (containsArabic(userInput.value)) {
            userInput.setAttribute('dir', 'rtl');
        } else {
            userInput.setAttribute('dir', 'ltr');
        }
    });

    // Enhanced AI-assisted search function
    async function determineQueryRelevance(query, knowledgeTopics) {
        try {
            // Call our Netlify function proxy for query relevance
            const response = await fetch('/api/query-relevance-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    knowledgeTopics
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get relevance assessment');
            }

            const result = await response.json();
            console.log('AI Relevance Check:', result);
            return result;
        } catch (error) {
            console.error('Error determining query relevance:', error);
            return { isRelevant: false, certainty: 0, explanation: 'Error in API call' };
        }
    }

    // Knowledge base search and handling
    const knowledgeBase = {
        data: [],
        initialized: false,
        
        // Initialize the knowledge base by loading all files from the Mydata folder
        init: async function() {
            if (this.initialized) return;
            
            try {
                // First, try to get a directory listing (this will only work if the server supports it)
                // Fallback to known files if directory listing fails
                try {
                    const dirResponse = await fetch('/Mydata/');
                    // If directory listing is available, parse it to find text files
                    // However, most simple HTTP servers won't support this, so we'll fallback
                    console.log('Directory listing not supported, using fallback method');
                } catch (e) {
                    console.log('Using fallback file loading method');
                }
                
                // List of files to load - can be expanded
                const filesToLoad = [
                    { path: '/Mydata/lab programs.md', type: 'program-examples' }
                    // Add more files here as needed, with their type for processing
                    // Example: { path: '/Mydata/physics.txt', type: 'qa-pairs' }
                ];
                
                // Load each file and process according to its type
                for (const file of filesToLoad) {
                    try {
                        const response = await fetch(file.path);
                        if (!response.ok) {
                            console.error(`Failed to load file: ${file.path}`);
                            continue;
                        }
                        
                        const content = await response.text();
                        const processedData = this.processContent(content, file.type, file.path);
                        
                        // Add to our knowledge base data
                        this.data = [...this.data, ...processedData];
                    } catch (fileError) {
                        console.error(`Error loading ${file.path}:`, fileError);
                    }
                }
                
                this.initialized = true;
                console.log(`Knowledge base initialized with ${this.data.length} entries`);
                console.log('Knowledge topics:', this.getTopics());
            } catch (error) {
                console.error('Error initializing knowledge base:', error);
            }
        },
        
        // Process content based on file type
        processContent: function(content, type, filePath) {
            switch (type) {
                case 'program-examples':
                    return this.processProgramExamples(content, filePath);
                // Add more content types here as needed
                // case 'qa-pairs': return this.processQAPairs(content, filePath);
                // case 'articles': return this.processArticles(content, filePath);
                default:
                    console.warn(`Unknown content type: ${type}, attempting generic processing`);
                    return this.processGenericContent(content, filePath);
            }
        },
        
        // Process program examples (current format in lab programs.md)
        processProgramExamples: function(content, filePath) {
            // Split the content by numbered program examples
            const programEntries = content.split(/\d+\)\s+/).filter(entry => entry.trim().length > 0);
            
            return programEntries.map((entry, index) => {
                // Extract the description line (first line of the entry)
                const lines = entry.trim().split('\n');
                const description = lines[0].trim();
                const code = lines.slice(1).join('\n').trim();
                
                // Extract topics and concepts from the content
                const mainTopics = this.extractMainTopic(description);
                
                // Create a structured entry
                return {
                    id: `program-${index + 1}`,
                    source: filePath,
                    type: 'program',
                    description,
                    code,
                    fullText: entry.trim(),
                    keywords: this.extractKeywords(description + ' ' + code),
                    mainTopics,
                    programmingConcepts: this.extractProgrammingConcepts(code)
                };
            });
        },
        
        // Process generic text content as a fallback
        processGenericContent: function(content, filePath) {
            // Split content into paragraphs
            const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
            
            // Process each paragraph as a separate knowledge item
            return paragraphs.map((paragraph, index) => {
                const lines = paragraph.trim().split('\n');
                const title = lines[0].trim();
                const body = lines.slice(1).join('\n').trim() || title;
                
                // Extract keywords from the content
                const keywords = this.extractKeywords(paragraph);
                
                // Try to identify topics from content
                const possibleTopics = this.extractTopicsFromText(paragraph);
                
                return {
                    id: `content-${filePath}-${index + 1}`,
                    source: filePath,
                    type: 'text',
                    title,
                    body,
                    fullText: paragraph,
                    keywords,
                    mainTopics: possibleTopics
                };
            });
        },
        
        // Extract potential topics from generic text
        extractTopicsFromText: function(text) {
            const topics = [];
            const lowercaseText = text.toLowerCase();
            
            // Check for common programming-related topics
            if (/\bc\+\+|\bprogramming|\bcode|\bfunction|\balgorithm/i.test(lowercaseText)) {
                topics.push('programming');
            }
            
            // Check for character processing topics
            if (/character|letter|digit|string|text|isalpha|isdigit/i.test(lowercaseText)) {
                topics.push('character processing');
            }
            
            // Add more topic detection rules as needed
            
            return topics;
        },
        
        // Add a new file to the knowledge base
        addFile: async function(filePath, type = 'generic') {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    console.error(`Failed to load file: ${filePath}`);
                    return false;
                }
                
                const content = await response.text();
                const processedData = this.processContent(content, type, filePath);
                
                // Add to our knowledge base data
                this.data = [...this.data, ...processedData];
                console.log(`Added ${processedData.length} entries from ${filePath}`);
                return true;
            } catch (error) {
                console.error(`Error adding file ${filePath}:`, error);
                return false;
            }
        },
        
        // Generate response based on entry type
        generateResponse: function(entry) {
            // Handle different entry types with appropriate response formats
            switch (entry.type) {
                case 'program':
                    return this.generateProgramResponse(entry);
                case 'text':
                    return this.generateTextResponse(entry);
                default:
                    return this.generateGenericResponse(entry);
            }
        },
        
        // Generate response for program entries
        generateProgramResponse: function(entry) {
            return `Based on our custom knowledge base, here's a C++ program that ${entry.description.toLowerCase()}:

## ${entry.description}

\`\`\`cpp
${entry.code}
\`\`\`

This program works by checking each character in the input string using the \`${entry.code.includes('isalpha') ? 'isalpha()' : 'isdigit()'}\` function from the C++ standard library, which determines whether a character is a ${entry.code.includes('isalpha') ? 'letter' : 'digit'} or not.`;
        },
        
        // Generate response for text entries
        generateTextResponse: function(entry) {
            return `Based on our custom knowledge base, here's information about ${entry.title}:

## ${entry.title}

${entry.body}

*Source: ${entry.source}*`;
        },
        
        // Generic response for unknown entry types
        generateGenericResponse: function(entry) {
            return `Based on our custom knowledge base, here's relevant information:

## ${entry.id}

${entry.fullText}

*Source: ${entry.source}*`;
        },
        
        // Get list of all topics in the knowledge base
        getTopics: function() {
            if (!this.data || this.data.length === 0) return [];
            
            const allTopics = new Set();
            this.data.forEach(entry => {
                if (entry.mainTopics) {
                    entry.mainTopics.forEach(topic => allTopics.add(topic));
                }
            });
            
            return Array.from(allTopics);
        },
        
        // Extract main topics from the description
        extractMainTopic: function(description) {
            const topics = [];
            
            // Check for specific topics using regex
            if (/recognize\s+(letter|digit|character)/i.test(description)) {
                topics.push('character recognition');
            }
            
            if (/letter|alphabet|alphabetical/i.test(description)) {
                topics.push('letter recognition');
            }
            
            if (/digit|number|numerical/i.test(description)) {
                topics.push('digit recognition');
            }
            
            if (/isalpha/i.test(description)) {
                topics.push('letter checking');
            }
            
            if (/isdigit/i.test(description)) {
                topics.push('digit checking');
            }
            
            return topics;
        },
        
        // Extract programming concepts from code
        extractProgrammingConcepts: function(code) {
            const concepts = [];
            
            // Check for loops
            if (/(for|while)\s*\(/i.test(code)) {
                concepts.push('loops');
            }
            
            // Check for conditions
            if (/(if|else|switch)\s*[\({]/i.test(code)) {
                concepts.push('conditional statements');
            }
            
            // Check for functions
            if (/\b(isalpha|isdigit|strlen)\s*\(/i.test(code)) {
                concepts.push('character classification');
                concepts.push('string functions');
            }
            
            return concepts;
        },
        
        // Extract important keywords for searching
        extractKeywords: function(text) {
            // Extract programming-related terms and concepts
            const keywords = text.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 3 || /\b(c\+\+|if|for|int|char|void|main|cout|cin|string|program|write|code|class|include|isalpha|isdigit)\b/i.test(word));
                
            return [...new Set(keywords)]; // Remove duplicates
        },
        
        // Enhanced search that uses both local scoring and AI relevance check
        search: async function(query) {
            if (!this.initialized || !this.data || this.data.length === 0) {
                return null;
            }
            
            // First, get topics from our knowledge base
            const knowledgeTopics = this.getTopics();
            
            // Get AI assistance with determining relevance
            const aiRelevance = await determineQueryRelevance(query, knowledgeTopics);
            console.log('AI Relevance Assessment:', aiRelevance);
            
            // If AI is very certain the query is NOT relevant to our knowledge base
            if (!aiRelevance.isRelevant && aiRelevance.certainty > 70) {
                console.log('AI determined query is not relevant to our knowledge base');
                return null; // Skip knowledge base and use general AI
            }
            
            // If AI found a specific matching topic, prioritize entries with that topic
            let aiMatchedTopic = aiRelevance.matchedTopic;
            
            // Perform our traditional scoring as a backup/supplement
            const queryKeywords = this.extractKeywords(query.toLowerCase());
            const queryLower = query.toLowerCase();
            
            // Do local relevance checks
            const hasExplicitTopic = this.checkForExplicitTopics(queryLower);
            
            // Score each knowledge base entry
            const scoredResults = this.data.map(entry => {
                let score = 0;
                
                // If AI identified a specific matching topic and this entry has it
                if (aiMatchedTopic && entry.mainTopics && entry.mainTopics.some(topic => 
                    topic.toLowerCase().includes(aiMatchedTopic.toLowerCase()) ||
                    aiMatchedTopic.toLowerCase().includes(topic.toLowerCase())
                )) {
                    score += 40; // Major boost for AI-identified topic match
                }
                
                // Add AI's general certainty as a boost if it thinks it's relevant
                if (aiRelevance.isRelevant) {
                    score += Math.min(30, aiRelevance.certainty / 3); // Up to 30 points based on AI certainty
                }
                
                // Calculate traditional topic matches
                const topicMatches = this.calculateTopicRelevance(entry, queryLower);
                score += topicMatches.score;
                
                // Calculate keyword match score (secondary importance)
                queryKeywords.forEach(keyword => {
                    // Check for direct keyword matches
                    if (entry.keywords.includes(keyword)) {
                        score += 5;
                    }
                    
                    // Check for partial keyword matches
                    entry.keywords.forEach(entryKeyword => {
                        if (entryKeyword.includes(keyword) || keyword.includes(entryKeyword)) {
                            score += 2;
                        }
                    });
                    
                    // Check for matches in the description/title
                    const searchableText = entry.description || entry.title || '';
                    if (searchableText.toLowerCase().includes(keyword)) {
                        score += 5;
                    }
                });
                
                // Check if the query fits our knowledge domain tightly
                if (hasExplicitTopic) {
                    score += 15;
                }
                
                return {
                    entry,
                    score,
                    aiMatched: aiMatchedTopic && entry.mainTopics && entry.mainTopics.some(topic => 
                        topic.toLowerCase().includes(aiMatchedTopic.toLowerCase()) ||
                        aiMatchedTopic.toLowerCase().includes(topic.toLowerCase())
                    )
                };
            });
            
            // Determine threshold - AI relevance affects this
            let threshold = 20;
            
            // If AI is confident this IS relevant
            if (aiRelevance.isRelevant && aiRelevance.certainty > 80) {
                threshold = 15; // Lower threshold if AI thinks it's relevant
            } 
            // If AI is confident this is NOT relevant
            else if (!aiRelevance.isRelevant && aiRelevance.certainty > 50) {
                threshold = 40; // Higher threshold to override AI's judgment
            }
            
            console.log(`Using relevance threshold: ${threshold} (adjusted by AI assessment)`);
            
            // Sort by score and filter relevant results
            const results = scoredResults
                .filter(result => result.score > threshold)
                .sort((a, b) => {
                    // Prioritize results that match AI's identified topic
                    if (a.aiMatched && !b.aiMatched) return -1;
                    if (!a.aiMatched && b.aiMatched) return 1;
                    // Then sort by score
                    return b.score - a.score;
                });
            
            console.log('Filtered Results:', results.length > 0 ? 
                results.map(r => ({ 
                    score: r.score, 
                    aiMatched: r.aiMatched, 
                    type: r.entry.type,
                    desc: (r.entry.description || r.entry.title || '').substring(0, 30) 
                })) : 
                'No relevant matches'
            );
            
            // Return the best match if found
            return results.length > 0 ? results[0].entry : null;
        },
        
        // Calculate topic relevance score
        calculateTopicRelevance: function(entry, queryLower) {
            let score = 0;
            
            // Skip if no topics
            if (!entry.mainTopics) return { score: 0 };
            
            // Check for direct topic matches
            entry.mainTopics.forEach(topic => {
                if (queryLower.includes(topic)) {
                    score += 20;  // Major boost for direct topic match
                }
                
                // Check for related terms
                const topicTerms = topic.split(/\s+/);
                topicTerms.forEach(term => {
                    if (term.length > 3 && queryLower.includes(term)) {
                        score += 10;
                    }
                });
            });
            
            // Check for programming concept matches if they exist
            if (entry.programmingConcepts) {
                entry.programmingConcepts.forEach(concept => {
                    if (queryLower.includes(concept)) {
                        score += 5;
                    }
                });
            }
            
            return { score };
        },
        
        // Check if query explicitly mentions topics in our knowledge base
        checkForExplicitTopics: function(query) {
            const explicitPatterns = [
                /\b(recognize|check|identify)\s+(letter|alphabet|character|digit|number)/i,
                /\b(letter|character|digit)\s+(recognition|identification|check)/i,
                /\bisalpha\b/i,
                /\bisdigit\b/i,
                /\bcharacter\s+classification\b/i
            ];
            
            return explicitPatterns.some(pattern => pattern.test(query));
        }
    };

    // Initialize the knowledge base at startup
    (async function() {
        await knowledgeBase.init();
    })();

    // Function to handle user messages and check knowledge base first
    // ... existing code ...
}); 