const voiceMap = {
    'en': 'en-US',
    'fr': 'fr-FR',
    'ar': 'ar-SA',
    'fa': 'fa-IR'
};

// Process each sentence block
document.querySelectorAll('.sentence-block').forEach(block => {
    const lang = block.dataset.lang;
    const sentenceEl = block.querySelector('.sentence');
    const originalText = sentenceEl.innerText.trim();
    const words = originalText.split(/\s+/);

    // Replace with span-wrapped words
    sentenceEl.innerHTML = '';
    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.classList.add('word');
        span.innerText = word;
        span.dataset.index = i;
        sentenceEl.appendChild(span);
        sentenceEl.append(' '); // space between words

        // Hover: speak just the word
        span.addEventListener('mouseenter', () => {
            speak(word, voiceMap[lang]);
        });

        // Click: speak word + remainder with synced highlighting
        span.addEventListener('click', () => {
            const remainingWords = words.slice(i);
            highlightSequence(sentenceEl, i, remainingWords, voiceMap[lang]);
        });
    });
});

function speak(text, lang = 'en-US') {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
}

function highlightSequence(container, startIndex, wordArray, lang) {
    window.speechSynthesis.cancel();

    const spans = container.querySelectorAll('.word');
    spans.forEach(span => span.style.backgroundColor = ''); // Clear all highlights

    const fullSentence = wordArray.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullSentence);
    utterance.lang = lang;

    let currentWord = 0;

    utterance.onboundary = function (event) {
        if (event.name === 'word') {
            const index = startIndex + currentWord;

            // Clear all highlights
            spans.forEach(span => span.style.backgroundColor = '');

            // Highlight current word
            if (spans[index]) {
                spans[index].style.backgroundColor = 'yellow';
            }

            currentWord++;
        }
    };

    utterance.onend = () => {
        // Clear all highlights after speaking
        spans.forEach(span => span.style.backgroundColor = '');
    };

    window.speechSynthesis.speak(utterance);
}
