// Initialize speech synthesis settings
let currentLang = 'en';

function handleWordClick(event) {
    const word = event.target;
    const sentence = word.parentNode;
    
    // Reset highlight
    Array.from(sentence.children).forEach(child => {
        child.classList.remove('highlight');
    });

    // Highlight the clicked word and play sound
    word.classList.add('highlight');
    const text = sentence.innerText;
    responsiveVoice.speak(text, getVoiceForLang(currentLang), {
        rate: 1.3, // Adjust rate of speech
        onstart: function () {
            word.classList.add('highlight');
        }
    });
}

// Function to get the correct voice for the language
function getVoiceForLang(lang) {
    switch (lang) {
        case 'fr': return 'French Female';
        case 'ar': return 'Arabic Female';
        case 'fa': return 'Persian Female';
        default: return 'US English Female';
    }
}

// Add event listeners to each word in the text
document.querySelectorAll('.text-content').forEach(sentence => {
    sentence.addEventListener('click', handleWordClick);
});

// Add hover functionality for text highlighting
document.querySelectorAll('.text-content').forEach(sentence => {
    sentence.addEventListener('mouseover', function (event) {
        if (event.target.tagName === 'SPAN') {
            event.target.classList.add('highlight');
            responsiveVoice.speak(event.target.innerText, getVoiceForLang(currentLang), {rate: 1.3});
        }
    });
    sentence.addEventListener('mouseout', function (event) {
        if (event.target.tagName === 'SPAN') {
            event.target.classList.remove('highlight');
        }
    });
});
