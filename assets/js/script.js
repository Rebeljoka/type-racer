window.addEventListener('DOMContentLoaded', () => {
    // Sample texts by difficulty
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


    // DOM elements
    const [typingArea, startBtn, stopBtn, retryBtn, resultLevel, resultTime, resultWpm, difficultySelect, promptDisplay, userInputDisplay] = [
        'typing-area', 'start-btn', 'stop-btn', 'retry-btn', 'result-level', 'result-time', 'result-wpm', 'difficulty-select', 'prompt-display', 'user-input-display'
    ].map(id => document.getElementById(id));


    // State
    let startTime = null, timerRunning = false, countdownInterval, currentPrompt = "";


    // Utility
    const countCorrectWords = (ref, input) => ref.trim().split(/\s+/).filter((w, i) => w === input.trim().split(/\s+/)[i]).length;


    // UI update
    const setRandomPrompt = () => {
        const texts = sampleTexts[difficultySelect.value] || sampleTexts.easy;
        currentPrompt = texts[Math.floor(Math.random() * texts.length)];
        updateDisplays();
    };

    const updateDisplays = () => {
        promptDisplay.textContent = currentPrompt;
        const userInput = typingArea.value;
        userInputDisplay.innerHTML = !userInput
            ? `<span class='user-placeholder'>Click the start button to begin the test!</span>`
            : Array.from(userInput).map((c, i) =>
                c === currentPrompt[i]
                    ? `<span>${c}</span>`
                    : `<span class='incorrect'>${c || ' '}</span>`
            ).join('');
    };

    const resetTest = () => {
        typingArea.value = '';
        typingArea.setAttribute('readonly', true);
        resultTime.textContent = '0.00s';
        resultWpm.textContent = '0';
        resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
        setRandomPrompt();
        updateDisplays();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    const startCountdown = () => {
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

        const handleCancel = () => {
            clearInterval(countdownInterval);
            countdownModal.hide();
            startBtn.disabled = false;
            stopBtn.disabled = true;
            cancelBtn.removeEventListener('click', handleCancel);
        };
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
                countdownModalEl.addEventListener('hidden.bs.modal', () => {
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
    };

    const stopTest = () => {
        if (!timerRunning) return;
        timerRunning = false;
        typingArea.setAttribute('readonly', true);
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        const correctWords = countCorrectWords(currentPrompt, typingArea.value);
        const wpm = timeTaken > 0 ? Math.round((correctWords / timeTaken) * 60) : 0;
        resultTime.textContent = `${timeTaken.toFixed(2)}s`;
        resultWpm.textContent = wpm;
        resultLevel.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
        stopBtn.disabled = true;
    };


    const retryTest = () => resetTest();

    const handleTypingInput = () => {
        updateDisplays();
        if (timerRunning && typingArea.value === currentPrompt) {
            stopTest();
            alert('Congrats! Check the box on the right or below to review your Results!');
        }
    };

    // Event listeners
    typingArea.addEventListener('input', handleTypingInput);
    startBtn.addEventListener('click', startCountdown);
    stopBtn.addEventListener('click', stopTest);
    retryBtn.addEventListener('click', retryTest);
    difficultySelect.addEventListener('change', resetTest);
    // Init
    resetTest();
});