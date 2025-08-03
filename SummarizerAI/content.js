// content.js

// Listens for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    // Get the currently highlighted text on the page
    const selectedText = window.getSelection().toString();

    // If nothing is selected, send an error message back
    if (!selectedText) {
      sendResponse({ summary: "Please highlight some text." });
      return;
    }

    // Call the OpenRouter API \to summarize the text
    fetch("https://api.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "API KEY", // Replace with your actual key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
        messages: [
          { role: "system", content: "Summarize the following:" },
          { role: "user", content: selectedText }
        ]
      })
    })
    .then(res => res.json())
    .then(data => {
      // Extract the summary from the response
        let summary;

        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        summary = data.choices[0].message.content;
        } else {
        summary = "No summary found.";
        }

        sendResponse({ summary });  // send summary back to popup.js
    })
    .catch(err => {
      console.error("API error:", err);
      sendResponse({ summary: "Failed to fetch summary." });
    });

    return true; // Keep message channel open for async response
  }
});
