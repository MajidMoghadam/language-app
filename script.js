document.addEventListener("DOMContentLoaded", function() {
  const textElements = document.querySelectorAll('.text');

  textElements.forEach((textElement) => {
    textElement.addEventListener('mouseover', function() {
      // Highlight the word on hover
      textElement.style.backgroundColor = 'yellow';
      const lang = textElement.dataset.lang;

      // Synthesize speech for the word
      responsiveVoice.speak(textElement.textContent, lang);
    });

    textElement.addEventListener('mouseout', function() {
      // Remove highlight on mouse out
      textElement.style.backgroundColor = '';
    });

    textElement.addEventListener('click', function() {
      // Highlight the word and speak the full sentence when clicked
      textElement.style.backgroundColor = 'yellow';
      const lang = textElement.dataset.lang;
      responsiveVoice.speak(textElement.textContent, lang);
      
      // Sync highlighting with speaking
      const words = textElement.textContent.split(" ");
      let wordIndex = 0;

      // Function to highlight and speak each word
      const highlightWord = () => {
        if (wordIndex < words.length) {
          textElement.innerHTML = textElement.textContent.replace(words[wordIndex], `<span style="background-color: yellow">${words[wordIndex]}</span>`);
          responsiveVoice.speak(words[wordIndex], lang);
          wordIndex++;
          setTimeout(highlightWord, 500); // Adjust time to suit the voice speed
        }
      };

      highlightWord();
    });
  });
});
