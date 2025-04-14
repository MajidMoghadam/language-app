document.querySelectorAll('.sentence').forEach(p => {
  const lang = p.getAttribute('lang');
  const words = p.textContent.trim().split(' ');
  p.innerHTML = '';

  words.forEach((word, idx) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.classList.add('word');
    span.dataset.index = idx;
    p.appendChild(span);
    if (idx !== words.length - 1) {
      p.appendChild(document.createTextNode(' '));
    }

    // Single tap (hover replacement)
    span.addEventListener('click', e => {
      e.stopPropagation();
      speakWord(word, lang);
      highlight(span);
    });

    // Double tap or double click: speak sentence from word
    span.addEventListener('dblclick', e => {
      e.stopPropagation();
      speakSentenceFrom(span, lang);
    });
  });
});

function speakWord(word, lang) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function speakSentenceFrom(startSpan, lang) {
  const container = startSpan.parentElement;
  const allSpans = Array.from(container.querySelectorAll('.word'));
  const startIndex = allSpans.indexOf(startSpan);
  const toSpeak = allSpans.slice(startIndex);

  window.speechSynthesis.cancel();

  let i = 0;
  function speakNext() {
    if (i > 0) allSpans[startIndex + i - 1].classList.remove('hovered');
    if (i >= toSpeak.length) return;

    const wordSpan = toSpeak[i];
    const utter = new SpeechSynthesisUtterance(wordSpan.textContent);
    utter.lang = lang;

    utter.onstart = () => {
      wordSpan.classList.add('hovered');
    };
    utter.onend = () => {
      wordSpan.classList.remove('hovered');
      i++;
      speakNext();
    };

    window.speechSynthesis.speak(utter);
  }

  speakNext();
}

function highlight(span) {
  document.querySelectorAll('.word').forEach(w => w.classList.remove('hovered'));
  span.classList.add('hovered');
}

// PWA service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service Worker registered:', reg.scope))
    .catch(err => console.error('Service Worker registration failed:', err));
}
