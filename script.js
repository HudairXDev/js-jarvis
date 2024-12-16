let recognition;
let isListeningMode = false; // Tracks if the assistant is active

// Initialize speech recognition
function initSpeechRecognition() {
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Listening...");
      speak("Listening...");
    };

    recognition.onresult = (event) => {
      const userCommand =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("User said:", userCommand);

      if (!isListeningMode) {
        if (userCommand.includes("jarvis")) {
          isListeningMode = true; // Enable command listening mode after detecting Jarvis
          speak("Yes, I am listening now.");
        }
      } else {
        executeCommand(userCommand);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      speak("I couldn't process that.");
    };

    recognition.onend = () => {
      console.log("Stopped listening.");
      if (isListeningMode) {
        recognition.start();
      }
    };
  } else {
    alert("Speech recognition is not supported.");
  }
}

// Text-to-speech helper
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
  document.getElementById("response").innerText = text;
}

// Handle commands
function executeCommand(command) {
  if (command.includes("time")) {
    const now = new Date().toLocaleTimeString();
    speak(`The current time is ${now}`);
  } else if (command.includes("date")) {
    const today = new Date().toLocaleDateString();
    speak(`Today's date is ${today}`);
  } else if (command.includes("youtube")) {
    const searchTerm = command.replace("youtube", "").trim();
    speak(`Searching YouTube for ${searchTerm}`);
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchTerm
      )}`
    );
  } else if (command.includes("google")) {
    const searchTerm = command.replace("google", "").trim();
    speak(`Searching Google for ${searchTerm}`);
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`
    );
  } else if (command.includes("wikipedia")) {
    const searchTerm = command.replace("wikipedia", "").trim();
    searchWikipedia(searchTerm);
  } else {
    speak("I don't know how to assist with that.");
  }
}

// Search Wikipedia
function searchWikipedia(query) {
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.extract) {
        speak(data.extract);
      } else {
        speak("I couldn't find any information on that.");
      }
    })
    .catch(() => speak("An error occurred while searching Wikipedia."));
}

// Start recognition only the first time with "Jarvis"
function startListening() {
  if (!recognition) {
    initSpeechRecognition();
  }

  if (!isListeningMode) {
    recognition.start();
    console.log("Listening for wake word.");
  }
}

// Stop all listening
function stopListening() {
  if (recognition) {
    recognition.stop();
    isListeningMode = false;
    speak("Stopped listening.");
  }
}
