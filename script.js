const voiceMap = {};
let voicesLoaded = false;

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  voices.forEach(voice => {
    if (voice.lang.startsWith('en')) voiceMap['en'] = voice;
    else if (voice.lang.startsWith('fr')) voiceMap['fr'] = voice;
    else if (voice.lang.startsWith('ar')) voiceMap['ar'] = voice;
    else if (voice.lang.startsWith('fa')) voiceMap['fa'] = voice;
  });
  voicesLoaded = true;
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function wrapWords() {
  document.querySelectorAll("p").forEach(p => {
    const lang = p.getAttribute("lang");
    const text = p.textContent.trim();
    p.innerHTML = text
      .split(" ")
      .map(word => `<span class="word" data-lang="${lang}">${word}</span>`)
      .join(" ");
  });
}

wrapWords();

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("word")) return;

  const lang = e.target.dataset.lang;
  const words = Array.from(e.target.parentElement.querySelectorAll(".word"));
  const index = words.indexOf(e.target);
  const restWords = words.slice(index);

  speakWordsSequentially(restWords, lang);
});

document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("word")) {
    clearHighlights();
    e.target.classList.add("highlight");
    const word = e.target.textContent;
    const lang = e.target.dataset.lang;
    speak(word, lang);
  }
});

function speak(text, lang) {
  if (!voicesLoaded) {
    console.warn("Voices not loaded yet.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  if (voiceMap[lang.slice(0, 2)]) {
    utterance.voice = voiceMap[lang.slice(0, 2)];
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function speakWordsSequentially(words, lang) {
  speechSynthesis.cancel();
  let i = 0;

  function speakNext() {
    if (i > 0) words[i - 1].classList.remove("highlight");

    if (i < words.length) {
      const word = words[i];
      word.classList.add("highlight");

      const utter = new SpeechSynthesisUtterance(word.textContent);
      utter.lang = lang;

      if (voiceMap[lang.slice(0, 2)]) {
        utter.voice = voiceMap[lang.slice(0, 2)];
      }

      utter.onend = () => {
        i++;
        speakNext();
      };

      speechSynthesis.speak(utter);
    } else if (i === words.length) {
      words[i - 1].classList.remove("highlight");
    }
  }

  speakNext();
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach(el =>
    el.classList.remove("highlight")
  );
}
