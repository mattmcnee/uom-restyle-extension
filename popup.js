
// This sets up the JSON with the chosen style
function initialiseUserData(styleChoice){
  if (styleChoice == "default") {
    const temp = 
    {
      theme: "light",
      style: "default",
      light: {
        mainTheme: "#5E0366",
        backgroundMain: "#fff",
        backgroundMainOutline: "#eee",
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
  else if( styleChoice == "blackboard"){
    const temp = 
    {
      theme: "light",
      style: "blackboard",
      light: {
        mainTheme: "#333",
        backgroundMain: "#fff",
        backgroundMainOutline: "#eee",
        backgroundTint1: "#fbfbfb",
        backgroundTint1Highlight: "#f4f4f4",
        backgroundTint2: "#fefefe",
        backgroundTint2Highlight: "#f7f7f7",
        secondaryButton: "#dadada",
        secondaryButtonHighlight: "#e8e8e8",
        secondaryButtonText: "#333",
        primaryButton: "#333",
        primaryButtonHighlight: "#353535",
        primaryButtonText: "#eee",
        textMain: "#000",
        textLight: "#555",
        globalFont: "Open Sans, sans-serif"
      },
      dark: {
        mainTheme: "#333",
        backgroundMain: "#111",
        backgroundMainOutline: "#333",
        backgroundTint1: "#191919",
        backgroundTint1Highlight: "#191919",
        backgroundTint2: "#222",
        backgroundTint2Highlight: "#222",
        secondaryButton: "#555",
        secondaryButtonHighlight: "#585858",
        secondaryButtonText: "#ddd",
        primaryButton: "#333",
        primaryButtonHighlight: "#353535",
        primaryButtonText: "#eee",
        textMain: "#ccc",
        textLight: "#999",
        globalFont: "Open Sans, sans-serif"
      }
    };
    return temp; 
  }

  else if( styleChoice == "forest"){
    const temp = 
    {
      theme: "light",
      style: "forest",
      light: {
        mainTheme: "#124a01",
        backgroundMain: "#fff",
        backgroundMainOutline: "#eee",
        backgroundTint1: "#fbfbfb",
        backgroundTint1Highlight: "#f4f4f4",
        backgroundTint2: "#fefefe",
        backgroundTint2Highlight: "#f7f7f7",
        secondaryButton: "#dadada",
        secondaryButtonHighlight: "#e8e8e8",
        secondaryButtonText: "#333",
        primaryButton: "#124a01",
        primaryButtonHighlight: "#165902",
        primaryButtonText: "#eee",
        textMain: "#000",
        textLight: "#555",
        globalFont: "Open Sans, sans-serif"
      },
      dark: {
        mainTheme: "#0d3601",
        backgroundMain: "#111",
        backgroundMainOutline: "#333",
        backgroundTint1: "#191919",
        backgroundTint1Highlight: "#191919",
        backgroundTint2: "#222",
        backgroundTint2Highlight: "#222",
        secondaryButton: "#555",
        secondaryButtonHighlight: "#585858",
        secondaryButtonText: "#ddd",
        primaryButton: "#0d3601",
        primaryButtonHighlight: "#124a01",
        primaryButtonText: "#eee",
        textMain: "#ccc",
        textLight: "#999",
        globalFont: "Open Sans, sans-serif"
      }
    };
    return temp; 
  }
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

function refreshStyles(){
  if (darkModeRadioButton.checked) {
    userData.theme = "dark";
  }
  else{
    userData.theme = "light";
  }

  // userData.light.mainTheme = mainThemeLight.value;
  // userData.light.backgroundMain = backgroundMainLight.value;
  // userData.light.textMain = mainTextLight.value;

  // Get active tab ID and send a message to content.js
  getActiveTabId(function (tabId) {
    sendMessageToContentScript(tabId, userData);
  });
}

function prefillColours() {
  if (userData.theme == "dark") {
    darkModeRadioButton.checked = true;
  }
  else{
    lightModeRadioButton.checked = true;
  }

  selectElement.value = userData.style;


  // mainThemeLight.value = userData.light.mainTheme;
  // backgroundMainLight.value = userData.light.backgroundMain;
  // mainTextLight.value = userData.light.textMain;
}

var userData;
var lightModeRadioButton;
var darkModeRadioButton;
var selectElement;
document.addEventListener("DOMContentLoaded", function() {

  // Initialises radio buttons
  lightModeRadioButton = document.getElementById("lightMode");
  darkModeRadioButton = document.getElementById("nightMode");
  lightModeRadioButton.addEventListener("change", refreshStyles);
  darkModeRadioButton.addEventListener("change", refreshStyles);

  // Initialises select element
  selectElement = document.getElementById('styleSelect');
  selectElement.addEventListener('change', function() {
      const selectedOption = selectElement.value;
      if (selectedOption == "stylesheet") {
          userData.style = selectedOption;
      }
      else{
        userData = initialiseUserData(selectedOption);
      }
      refreshStyles();
  });

  // Loads userData
  try{
    chrome.storage.local.get(["userData"], (result) => {
      console.log("Data retrieved:", result.userData.theme);
      userData = result.userData;
      prefillColours(userData);
    });
  } catch (error){
    userData = initialiseUserData("default");
    prefillColours(userData);
  }

});


// var button = document.getElementById("refreshButton");
// var resetButton = document.getElementById("restyleCheckbox")
// button.addEventListener("click", refreshStyles);

// var mainThemeLight = document.getElementById("mainThemeLight");
// var mainThemeDark = document.getElementById("mainThemeDark");
// var backgroundMainLight = document.getElementById("backgroundMainLight");
// var backgroundMainDark = document.getElementById("backgroundMainDark");
// var mainTextLight = document.getElementById("mainTextLight");
// var mainTextDark = document.getElementById("mainTextDark");
// var fontLight = document.getElementById("fontLight");
// var fontDark = document.getElementById("fontDark");
// var backgroundMainOutlineLight = document.getElementById("backgroundMainOutlineLight");
// var backgroundMainOutlineDark = document.getElementById("backgroundMainOutlineDark");
// var primaryButtonLight = document.getElementById("primaryButtonLight");
// var primaryButtonDark = document.getElementById("primaryButtonDark");
// var primaryButtonTextLight = document.getElementById("primaryButtonTextLight");
// var primaryButtonTextDark = document.getElementById("primaryButtonTextDark");
// var secondaryButtonLight = document.getElementById("secondaryButtonLight");
// var secondaryButtonDark = document.getElementById("secondaryButtonDark");
// var secondaryButtonTextLight = document.getElementById("secondaryButtonTextLight");
// var secondaryButtonTextDark = document.getElementById("secondaryButtonTextDark");





// mainTextLight
// mainTextDark
// fontLight
// fontDark
// backgroundMainOutlineLight
// backgroundMainOutlineDark
// primaryButtonLight
// primaryButtonDark
// primaryButtonTextLight
// primaryButtonTextDark
// secondaryButtonLight
// secondaryButtonDark
// secondaryButtonTextLight
// secondaryButtonTextDark











