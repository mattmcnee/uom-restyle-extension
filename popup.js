
// This sets up the JSON with the chosen style
function initialiseUserData(styleChoice){
    const temp = 
    {
      style: "default",
      theme: "dark",
      light: {
        mainTheme: "#5E0366",
        mainThemeStyled: "#5E0366",
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
        textLink: "#1874a4",
        globalFont: "Open Sans, sans-serif"
      },
      dark: {
        mainTheme: "#410247",
        mainThemeStyled: "#410247",
        backgroundMain: "#111",
        backgroundMainOutline: "#333",
        backgroundTint1: "#191919",
        backgroundTint1Highlight: "#191919",
        backgroundTint2: "#222",
        backgroundTint2Highlight: "#222",
        secondaryButton: "#555",
        secondaryButtonHighlight: "#777",
        secondaryButtonText: "#ddd",
        primaryButton: "#5E0366",
        primaryButtonHighlight: "#7a0485",
        primaryButtonText: "#eee",
        textMain: "#ccc",
        textLight: "#999",
        textLink: "#6ebff5",
        globalFont: "Open Sans, sans-serif"
      }
    };

  if(styleChoice == "default"){
    return temp;
  }
  else if(styleChoice == "blackboard"){
    temp.style = styleChoice;
    temp.light.mainTheme = "#333";
    temp.light.mainThemeStyled = "#333";
    temp.light.primaryButton = "#333";
    temp.light.primaryButtonHighlight = "#353535";
    temp.dark.mainTheme = "#333";
    temp.dark.mainThemeStyled = "#333";
    temp.dark.primaryButton = "#333";
    temp.dark.primaryButtonHighlight = "#353535";
    return temp; 
  }
  else if( styleChoice == "purple2"){
    temp.style = styleChoice;
    temp.light.mainTheme = "#6b2c90";
    temp.light.mainThemeStyled = "#6b2c90";
    temp.light.primaryButton = "#6b2c90";
    temp.light.primaryButtonHighlight = "#7832a1";
    temp.dark.mainTheme = "#401a56";
    temp.dark.mainThemeStyled = "#401a56";
    temp.dark.primaryButton = "#401a56";
    temp.dark.primaryButtonHighlight = "#542370";
    return temp; 
  }
  else if(styleChoice == "ocean"){
    temp.style = styleChoice;
    temp.light.mainTheme = "#005F52";
    temp.light.mainThemeStyled = "#005F52";
    temp.light.primaryButton = "#005F52";
    temp.light.primaryButtonHighlight = "#007a6a";
    temp.dark.mainTheme = "#01362e";
    temp.dark.mainThemeStyled = "#01362e";
    temp.dark.primaryButton = "#01362e";
    temp.dark.primaryButtonHighlight = "#005F52";
    return temp;   
  } 
    else if(styleChoice == "deco"){
    temp.style = styleChoice;
    temp.light.mainTheme = "#005F52";
    temp.light.mainThemeStyled = "linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 0 0 / 40px 40px, linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 20px 20px / 40px 40px";
    temp.light.primaryButton = "#005F52";
    temp.light.primaryButtonHighlight = "#007a6a";
    temp.light.backgroundMainOutline = "#d4c594"
    temp.dark.mainTheme = "#003A30";
    temp.dark.mainThemeStyled = "linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 0 0 / 40px 40px, linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 20px 20px / 40px 40px";
    temp.dark.primaryButton = "#003A30";
    temp.dark.primaryButtonHighlight = "#005F52";
    temp.dark.backgroundMainOutline = "#3b300a"
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
  chrome.storage.local.get(["userData"], (result) => {
    console.log("Data retrieved:", result);
    if(JSON.stringify(result) === '{}'){
      userData = initialiseUserData("default");
    }
    else{
      userData = result.userData;
    }
    prefillColours(userData);
  });

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











