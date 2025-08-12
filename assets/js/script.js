
// Typing test sample texts by difficulty
const sampleTexts = {
	easy: [
		"The cat sat on the mat.",
		"Dogs love to play fetch.",
		"It is a sunny day."
	],
	medium: [
		"Typing quickly takes practice and patience.",
		"The brown fox jumped over the lazy dog.",
		"Learning new skills can be fun and rewarding."
	],
	hard: [
		"Sphinx of black quartz, judge my vow and quickly type it out.",
		"Amazingly few discotheques provide jukeboxes with quality vinyl records.",
		"The quick onyx goblin jumps over the lazy dwarf, vexing him."
	]
};

// Get DOM elements
const difficultySelect = document.getElementById('difficulty-select');
const promptInput = document.getElementById('prompt-input');

// Function to set a random prompt based on difficulty
function setRandomPrompt(difficulty) {
	const texts = sampleTexts[difficulty] || sampleTexts.easy;
	const randomText = texts[Math.floor(Math.random() * texts.length)];
	promptInput.value = randomText;
}

// On difficulty change, update prompt
difficultySelect.addEventListener('change', function() {
	setRandomPrompt(this.value);
});

// On page load, set initial prompt
window.addEventListener('DOMContentLoaded', function() {
	setRandomPrompt(difficultySelect.value);
});
