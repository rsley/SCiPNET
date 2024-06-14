// scripts.js
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginDiv = document.getElementById('login');
    const terminalDiv = document.getElementById('terminal');
    const terminalInput = document.getElementById('input');
    const terminalOutput = document.getElementById('output');
    const loadingAnimation = document.getElementById('loading-animation');
    const promptDiv = document.getElementById('prompt');

    let username = '';
    let isLoggedIn = false;

    loginButton.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === 'admin' && password === 'password') {
            isLoggedIn = true;
            loginDiv.style.display = 'none';
            terminalDiv.style.display= 'block';
            promptDiv.textContent = `${username}@system : $`;
        } else {
            alert('Invalid username or password.');
        }
    });

    if (isLoggedIn) {
        terminalDiv.style.display = 'block';
    }

    const commandRegistry = {
        'help': 'commands/help.js',
        'command1': 'commands/command1.js',
        'command2': 'commands/command2.js',
        'classic21': 'commands/classic21.js'
    };

    terminalInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const input = terminalInput.value.trim();
            terminalInput.value = '';

            loadingAnimation.style.display = 'block';
            await handleCommand(input);
            loadingAnimation.style.display = 'none';

            displayOutput('\n'); // Add a new line between commands
        }
    });

    async function handleCommand(input) {
        const args = input.split(' ');
        const command = args[0];

        displayOutput(`${username}@system : $ ${input}`, false);

        if (commandRegistry[command]) {
            try {
                const module = await import(`./${commandRegistry[command]}`);
                module.executeCommand(displayOutput, args.slice(1));
            } catch (error) {
                displayOutput('Error executing command.');
            }
        } else {
            displayOutput(`Command not found: ${command}`);
        }
    }

    function displayOutput(message, isTyping = true) {
        const outputLine = document.createElement('div');
        terminalOutput.appendChild(outputLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        if (isTyping) {
            let index = 0;
            function typeEffect() {
                if (index < message.length) {
                    outputLine.textContent += message.charAt(index);
                    index++;
                    setTimeout(typeEffect, 20); // Faster typing effect
                }
            }
            typeEffect();
        } else {
            outputLine.textContent = message;
        }
    }

    // Initial welcome message
    const welcomeMessage = `
  _____  _____ _ _____  _   _ ______ _______ 
 / ____|/ ____(_)  __ \\| \\ | |  ____|__   __|
| (___ | |     _| |__) |  \\| | |__     | |   
 \\___ \\| |    | |  ___/|. \` |  __|    | |   
 ____) | |____| | |    | |\\  | |____   | |   
|_____/ \\_____|_|_|    |_| \\_|______|  |_|   
                                             
THE SCP FOUNDATION'S SECURE TERMINAL
    `;
    displayOutput(welcomeMessage, false); // No typing effect for the welcome message
});