const voiceMap = {};
let voicesLoaded = false;

function loadVoices() {
    const voices = speechSynthesis.getVoices();
    voices.forEach(voice => {
        if (voice.lang.startsWith('en')) voiceMap['en'] = voice;
        else if (voice.lang.startsWith('fr')) voiceMap['fr'] = voice;
        else if (voice.lang.startsWith('ar')) voiceMap['ar'] = voice;
        else if (voice.lang.startsWith('fa')) voiceMap['fa'] = voice; // Persian
    });
    voicesLoaded = true;
}

// Sometimes voices load asynchronously
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

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

    speechSynthesis.cancel(); // Stop previous speech
    speechSynthesis.speak(utterance);
}
