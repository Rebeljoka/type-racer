
window.addEventListener('DOMContentLoaded', function() {
    // Typing test sample texts by difficulty
    const sampleTexts = {
        easy: [
            "The cat sat on the mat.",
            "Dogs love to play fetch.",
            "It is a sunny day.",
            "Birds sing in the morning.",
            "She has a red hat.",
            "Milk is good for you.",
            "The sun rises in the east.",
            "Fish swim in the pond."
        ],
        medium: [
            "Typing quickly takes practice and patience.",
            "The brown fox jumped over the lazy dog.",
            "Learning new skills can be fun and rewarding.",
            "Children enjoy reading adventure stories at night.",
            "The weather forecast predicts rain tomorrow afternoon.",
            "My favorite subject in school is mathematics.",
            "Traveling by train can be both relaxing and scenic.",
            "The chef prepared a delicious meal for the guests."
        ],
        hard: [
            "Sphinx of black quartz, judge my vow and quickly type it out.",
            "Amazingly few discotheques provide jukeboxes with quality vinyl records.",
            "The quick onyx goblin jumps over the lazy dwarf, vexing him.",
            "Jovial zookeepers quickly mixed bright vials of fun chemicals.",
            "Waltz, nymph, for quick jigs vex Bud.",
            "Back in June we delivered oxygen equipment of the same size.",
            "The five boxing wizards jump quickly over the lazy dog.",
            "Crazy Frederick bought many very exquisite opal jewels."
        ]
    };

    // DOM elements for results and controls
    const typingArea = document.getElementById('typing-area');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const retryBtn = document.getElementById('retry-btn');
    const resultLevel = document.getElementById('result-level');
    const resultTime = document.getElementById('result-time');
    const resultWpm = document.getElementById('result-wpm');
    const difficultySelect = document.getElementById('difficulty-select');
    const promptDisplay = document.getElementById('prompt-display');
    const userInputDisplay = document.getElementById('user-input-display');

    // Timer variables
    let startTime = null;
    let timerRunning = false;
    let countdownInterval;

    // Utility: Count correctly typed words
    function countCorrectWords(reference, input) {
        const refWords = reference.trim().split(/\s+/);
        const inputWords = input.trim().split(/\s+/);
        let correct = 0;
        for (let i = 0; i < Math.min(refWords.length, inputWords.length); i++) {
            if (refWords[i] === inputWords[i]) {
                correct++;
            }
        }
        return correct;
    }

    // Function to set a random prompt based on selected difficulty
    let currentPrompt = "";
    function setRandomPrompt() {
        const texts = sampleTexts[difficultySelect.value] || sampleTexts.easy;
        currentPrompt = texts[Math.floor(Math.random() * texts.length)];
        renderPromptDisplay();
    }

    // Render the prompt with highlighting for incorrect letters
    function renderPromptDisplay() {
        // Show the prompt as normal text
        promptDisplay.textContent = currentPrompt;
        // Show the user's input with error highlighting or placeholder
        const userInput = typingArea.value;
        let html = "";
        if (!userInput) {
            html = `<span class='user-placeholder'>Click the start button to begin the test!</span>`;
        } else {
            for (let i = 0; i < userInput.length; i++) {
                const userChar = userInput[i];
                const promptChar = currentPrompt[i];
                if (userChar === promptChar) {
                    html += `<span>${userChar}</span>`;
                } else {
                    html += `<span class='incorrect'>${userChar || ' '}</span>`;
                }
            }
        }
        userInputDisplay.innerHTML = html;
    }

    // Initialize or reset the typing test
    function initializeTest() {
        typingArea.value = '';
        typingArea.setAttribute('readonly', true);
        resultTime.textContent = '0.00s';
        resultWpm.textContent = '0';
        resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
        setRandomPrompt();
        renderPromptDisplay();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    // Countdown modal logic for starting the test
    function showCountdownAndStartTest() {
        const countdownModalEl = document.getElementById('countdownModal');
        const countdownModal = new bootstrap.Modal(countdownModalEl);
        const countdownNumber = document.getElementById('countdown-number');
        const cancelBtn = document.getElementById('countdown-cancel-btn');
        let count = 3;
        countdownNumber.textContent = count;
        countdownModal.show();
        startBtn.disabled = true;
        stopBtn.disabled = true;
        typingArea.value = '';
        typingArea.setAttribute('readonly', true);

        // Cancel handler
        function handleCancel() {
            clearInterval(countdownInterval);
            countdownModal.hide();
            startBtn.disabled = false;
            stopBtn.disabled = true;
            cancelBtn.removeEventListener('click', handleCancel);
        }
        cancelBtn.addEventListener('click', handleCancel);

        countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownNumber.textContent = count;
            } else if (count === 0) {
                countdownNumber.textContent = 'GO!';
            } else {
                clearInterval(countdownInterval);
                countdownModal.hide();
                cancelBtn.removeEventListener('click', handleCancel);
                // Wait for modal to be fully hidden before enabling typing and starting timer
                countdownModalEl.addEventListener('hidden.bs.modal', function handler() {
                    typingArea.removeAttribute('readonly');
                    typingArea.focus();
                    startTime = Date.now();
                    timerRunning = true;
                    resultTime.textContent = '0.00s';
                    resultWpm.textContent = '0';
                    resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                }, { once: true });
            }
        }, 1000);
    }

    // Stop the typing test and calculate results
    function stopTest() {
        if (!timerRunning) return;
        timerRunning = false;
        typingArea.setAttribute('readonly', true);

        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // seconds

        const promptText = currentPrompt;
        const userInput = typingArea.value;

        const correctWords = countCorrectWords(promptText, userInput);
        const wpm = timeTaken > 0 ? Math.round((correctWords / timeTaken) * 60) : 0;

        resultTime.textContent = `${timeTaken.toFixed(2)}s`;
        resultWpm.textContent = wpm;
        resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
        stopBtn.disabled = true;
    }

    // Retry test logic
    function retryTest() {
        initializeTest();
    }

    // Automatically stop test if user input matches prompt exactly
    typingArea.addEventListener('input', onTypingInput);

    function onTypingInput() {
        // Always render prompt display first for instant feedback
        renderPromptDisplay();
        // Then check for completion
        if (timerRunning && typingArea.value === currentPrompt) {
            stopTest();
        }
    }

    // Attach event listeners to buttons
    startBtn.addEventListener('click', showCountdownAndStartTest);
    stopBtn.addEventListener('click', stopTest);
    retryBtn.addEventListener('click', retryTest);

    // On difficulty change, update prompt
    difficultySelect.addEventListener('change', initializeTest);

    // On page load, initialize the test
    initializeTest();
});