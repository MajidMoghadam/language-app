const textContainers = document.querySelectorAll('.text-container');

textContainers.forEach(container => {
  const lang = container.getAttribute('data-lang');
  const sentence = container.textContent.trim();
  container.innerHTML = ''; // Clear and replace with spans

  const words = sentence.split(/\s+/);
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.classList.add('word');
    span.dataset.index = index;
    container.appendChild(span);

    // Double tap (mobile) support
    let lastTap = 0;
    span.addEventListener('click', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        handleHover(span, lang);
      } else {
        handleClick(span, lang, words);
      }
      lastTap = currentTime;
    });

    // Desktop hover
    span.addEventListener('mouseenter', () => handleHover(span, lang));
    span.addEventListener('click', () => handleClick(span, lang, words));
  });
});

function handleHover(span, lang) {
  clearHighlight();
  span.classList.add('highlight');
  speakWord(span.textContent.trim(), lang);
}

function handleClick(span, lang, words) {
  clearHighlight();
  const startIndex = parseInt(span.dataset.index);
  const sentence = words.slice(startIndex).join(' ');
  speakSentence(sentence, lang, startIndex);
}

function speakWord(word, lang) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = lang;
  utterance.rate = 3.5; // SPEED UP to 3.5x
  speechSynthesis.speak(utterance);
}

function speakSentence(sentence, lang, startIndex) {
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = lang;
  utterance.rate = 3.5; // SPEED UP to 3.5x

  const allSpans = document.querySelectorAll(`[data-lang="${lang}"] .word`);

  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      const wordIndex = startIndex + getWordIndex(sentence, event.charIndex);
      highlightWord(allSpans, wordIndex);
    }
  };

  utterance.onend = () => {
    clearHighlight();
  };

  speechSynthesis.speak(utterance);
}

function getWordIndex(text, charIndex) {
  const before = text.slice(0, charIndex);
  return before.trim().split(/\s+/).length - 1;
}

function highlightWord(spans, index) {
  clearHighlight();
  const span = Array.from(spans).find(s => parseInt(s.dataset.index) === index);
  if (span) {
    span.classList.add('highlight');
  }
}

function clearHighlight() {
  document.querySelectorAll('.highlight').forEach(span => {
    span.classList.remove('highlight');
  });
}
