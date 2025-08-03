// popup.js

// When the summarize button is clicked...
document.getElementById("summarize").addEventListener("click", () => {
  // Find the currently active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Send a message to the content script on that tab
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "summarize" },  // Message payload
      (response) => {
        // Display the summary or fallback message
        document.getElementById("output").innerText = response?.summary || "No response.";
      }
    );
  });
});
