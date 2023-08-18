function initialiseUserData(){
  const temp = 
  {
    theme: "light",
    light: {
      mainTheme: "#5E0366",
      backgroundMain: "#fff",
      backgroundMainOutline: "#dddddd",
      backgroundTint1: "#fbfbfb",
      backgroundTint1Highlight: "#f4f4f4",
      backgroundTint2: "#fefefe",
      backgroundTint2Highlight: "#f7f7f7",
      secondaryButton: "#dadada",
      secondaryButtonHighlight: "#e8e8e8",
      secondaryButtonText: "#333",
      primaryButton: "#5E0366",
      primaryButtonHighlight: "#7a0485",
      primaryButtonText: "#eee",
      textMain: "#000",
      textLight: "#555",
      globalFont: "Open Sans, sans-serif"
    },
    dark: {
      mainTheme: "#410247",
      backgroundMain: "#111",
      backgroundMainOutline: "#333",
      backgroundTint1: "#191919",
      backgroundTint1Highlight: "#191919",
      backgroundTint2: "#222",
      backgroundTint2Highlight: "#222",
      secondaryButton: "#555",
      secondaryButtonHighlight: "#585858",
      secondaryButtonText: "#ddd",
      primaryButton: "#5E0366",
      primaryButtonHighlight: "#7a0485",
      primaryButtonText: "#eee",
      textMain: "#ccc",
      textLight: "#999",
      globalFont: "Open Sans, sans-serif"
    }
  };
  return temp; 
}








// Function to send a message to the background script
function getActiveTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0) {
      const activeTabId = tabs[0].id;
      callback(activeTabId);
    }
  });
}

// Function to send a message to the content script
function sendMessageToContentScript(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: sendMessageFunction,
    args: [message]
  });
}

// This function is executed in the content.js
function sendMessageFunction(message) {
  console.log(message);
  updateStyles(message);
}



try{
  chrome.storage.local.get(["userData"], (result) => {
    console.log("Data retrieved:", result.userData.theme);
    userData = result.userData;
  });
} catch (error){
  userData = initialiseUserData();
}

var button = document.getElementById("refreshButton");
button.addEventListener("click", refreshStyles);


function refreshStyles(){
  // Example usage: Get active tab ID and send a message to content.js
  getActiveTabId(function (tabId) {
    sendMessageToContentScript(tabId, userData);
  });
}

