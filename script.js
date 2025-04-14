function wrapWords(element) {
  const words = element.textContent.trim().split(/\s+/);
  element.innerHTML = "";
  words.forEach(word => {
    const span = document.createElement("span");
    span.textContent = word;
    element.appendChild(span);
    element.appendChild(document.createTextNode(" "));
  });
}

function speakFromWord(span, lang) {
  const spans = Array.from(span.parentNode.querySelectorAll("span"));
  const startIndex = spans.indexOf(span);
  const utter = new SpeechSynthesisUtterance();
  utter.lang = lang;
  utter.rate = 1;

  const wordsToSpeak = spans.slice(startIndex).map(s => s.textContent).join(" ");
  utter.text = wordsToSpeak;

  let currentIndex = startIndex;

  utter.onboundary = (event) => {
    if (event.name === "word") {
      spans.forEach(s => s.classList.remove("highlight"));
      if (spans[currentIndex]) spans[currentIndex].classList.add("highlight");
      currentIndex++;
    }
  };

  utter.onend = () => {
    spans.forEach(s => s.classList.remove("highlight"));
  };

  speechSynthesis.cancel(); // Stop any previous speech
  speechSynthesis.speak(utter);
}

document.querySelectorAll(".sentence").forEach(div => {
  const lang = div.getAttribute("lang");
  wrapWords(div);

  div.querySelectorAll("span").forEach(span => {
    span.addEventListener("mouseenter", () => {
      span.classList.add("highlight");
      const tempUtter = new SpeechSynthesisUtterance(span.textContent);
      tempUtter.lang = lang;
      tempUtter.rate = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(tempUtter);
    });

    span.addEventListener("mouseleave", () => {
      span.classList.remove("highlight");
    });

    span.addEventListener("click", () => {
      speakFromWord(span, lang);
    });

    // For mobile: double tap instead of hover
    span.addEventListener("touchstart", (e) => {
      span.classList.add("highlight");
      const tempUtter = new SpeechSynthesisUtterance(span.textContent);
      tempUtter.lang = lang;
      tempUtter.rate = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(tempUtter);
      setTimeout(() => span.classList.remove("highlight"), 1000);
    });
  });
});
