
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
    const promptInput = document.getElementById('prompt-input');

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
    function setRandomPrompt() {
        const texts = sampleTexts[difficultySelect.value] || sampleTexts.easy;
        promptInput.value = texts[Math.floor(Math.random() * texts.length)];
    }

    // Initialize or reset the typing test
    function initializeTest() {
        typingArea.value = '';
        typingArea.setAttribute('readonly', true);
        resultTime.textContent = '0.00s';
        resultWpm.textContent = '0';
        resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
        setRandomPrompt();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    // Countdown modal logic for starting the test
    function showCountdownAndStartTest() {
        const countdownModal = new bootstrap.Modal(document.getElementById('countdownModal'));
        const countdownNumber = document.getElementById('countdown-number');
        let count = 3;
        countdownNumber.textContent = count;
        countdownModal.show();
        startBtn.disabled = true;
        stopBtn.disabled = true;
        typingArea.value = '';
        typingArea.setAttribute('readonly', true);
        countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownNumber.textContent = count;
            } else if (count === 0) {
                countdownNumber.textContent = 'GO!';
            } else {
                clearInterval(countdownInterval);
                countdownModal.hide();
                // Wait for modal to be fully hidden before enabling typing and starting timer
                document.getElementById('countdownModal').addEventListener('hidden.bs.modal', function handler() {
                    typingArea.removeAttribute('readonly');
                    typingArea.focus();
                    startTime = Date.now();
                    timerRunning = true;
                    resultTime.textContent = '0.00s';
                    resultWpm.textContent = '0';
                    resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                    // Remove this event listener after it runs once
                    document.getElementById('countdownModal').removeEventListener('hidden.bs.modal', handler);
                });
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

        const promptText = promptInput.value;
        const userInput = typingArea.value;

        const correctWords = countCorrectWords(promptText, userInput);
        const wpm = timeTaken > 0 ? Math.round((correctWords / timeTaken) * 60) : 0;

        resultTime.textContent = `${timeTaken.toFixed(2)}s`;
        resultWpm.textContent = wpm;
        resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
    }

    // Retry test logic
    function retryTest() {
        initializeTest();
    }

    // Automatically stop test if user input matches prompt exactly
    typingArea.addEventListener('input', function() {
        if (timerRunning && typingArea.value === promptInput.value) {
            stopTest();
        }
    });

    // Attach event listeners to buttons
    startBtn.addEventListener('click', showCountdownAndStartTest);
    stopBtn.addEventListener('click', stopTest);
    retryBtn.addEventListener('click', retryTest);

    // On difficulty change, update prompt
    difficultySelect.addEventListener('change', setRandomPrompt);

    // On page load, initialize the test
    initializeTest();
});