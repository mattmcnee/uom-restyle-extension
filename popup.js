
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
        backgroundTint1Highlight: "#222222",
        backgroundTint2: "#1f1f1f",
        backgroundTint2Highlight: "#242424",
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
    temp.light.mainThemeStyled = "linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 0 0 / 50px 50px, linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 20px 20px / 50px 50px";
    temp.light.primaryButton = "#005F52";
    temp.light.primaryButtonHighlight = "#007a6a";
    temp.light.backgroundMainOutline = "#d4c594"

    temp.dark.mainTheme = "#003A30";
    temp.dark.mainThemeStyled = "linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 0 0 / 50px 50px, linear-gradient(45deg, #3b300a 25%, #003A30 25%, #000 75%, #3b300a 75%) 20px 20px / 50px 50px";
    temp.dark.primaryButton = "#003A30";
    temp.dark.primaryButtonHighlight = "#005F52";
    temp.dark.backgroundMainOutline = "#3b300a"
    return temp;   
  }  
  else if(styleChoice == "tron"){
    temp.style = styleChoice;
    temp.light.mainTheme = "#111";
    temp.light.mainThemeStyled = `
linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)) 0 0 / 75px 100%,
linear-gradient(black, transparent 19%, #2cb8ee 20%, transparent 21%, transparent 39%, #2cb8ee 40%, transparent 41%, transparent 59%, #2cb8ee 60%, transparent 61%, transparent 79%, #2cb8ee 80%, transparent 81%, black) 0 0 / 75px 100%,
linear-gradient(45deg, transparent 19%, #2cb8ee 20%, transparent 21%, transparent 39%, #2cb8ee 40%, transparent 41%, transparent 59%, #2cb8ee 60%, transparent 61%, transparent 79%, #2cb8ee 80%, transparent 81%)
  0 0 / 75px 100%,
linear-gradient(90deg, #2cb8ee, transparent 1%, transparent 39%, #2cb8ee 40%, transparent 41%, transparent 99%, #2cb8ee) 0 0 / 75px 100%,
linear-gradient(black, black) 0 0 / 75px 100%`;
    temp.light.primaryButton = "#3e8594";
    temp.light.primaryButtonHighlight = "#4fa1b3";
    temp.light.backgroundMainOutline = "#c3e0e6"

    temp.dark.mainTheme = "#111";
    temp.dark.mainThemeStyled = `
linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)) 0 0 / 75px 100%,
linear-gradient(black, transparent 19%, #2cb8ee 20%, transparent 21%, transparent 39%, #2cb8ee 40%, transparent 41%, transparent 59%, #2cb8ee 60%, transparent 61%, transparent 79%, #2cb8ee 80%, transparent 81%, black) 0 0 / 75px 100%,
linear-gradient(45deg, transparent 19%, #2cb8ee 20%, transparent 21%, transparent 39%, #2cb8ee 40%, transparent 41%, transparent 59%, #2cb8ee 60%, transparent 61%, transparent 79%, #2cb8ee 80%, transparent 81%)
  0 0 / 75px 100%,
linear-gradient(90deg, #2cb8ee, transparent 1%, transparent 39%, #2cb8ee 40%, transparent 41%, transparent 99%, #2cb8ee) 0 0 / 75px 100%,
linear-gradient(black, black) 0 0 / 75px 100%`;
    temp.dark.primaryButton = "#15556e";
    temp.dark.primaryButtonHighlight = "#005F52";
    temp.dark.backgroundMainOutline = "#15556e"
    return temp;   
  }  
  else if( styleChoice == "rustic"){
    temp.style = styleChoice;
    temp.light.mainTheme = "#A26952";
    temp.light.mainThemeStyled = "#A26952";
    temp.light.backgroundMain = "#e3dccf";
    temp.light.backgroundMainOutline = "#d9cfbd";
    temp.light.backgroundTint1 = "#e3dac8";
    temp.light.backgroundTint1Highlight = "#e6dbca";
    temp.light.backgroundTint2 = "#e4dbc9";
    temp.light.backgroundTint2Highlight = "#e6ddcb";
    temp.light.secondaryButton = "#847D72";
    temp.light.secondaryButtonHighlight = "#91897d";
    temp.light.secondaryButtonText = "#e7e7e7";
    temp.light.primaryButton = "#A26952";
    temp.light.primaryButtonHighlight = "#b3745b";
    temp.light.primaryButtonText = "#eee";

    temp.dark.mainTheme = "#453130";
    temp.dark.mainThemeStyled = "#453130";
    temp.dark.backgroundMain = "#212120";
    temp.dark.backgroundMainOutline = "#333";
    temp.dark.backgroundTint1 = "#242422";
    temp.dark.backgroundTint1Highlight = "#292926";
    temp.dark.backgroundTint2 = "#262624";
    temp.dark.backgroundTint2Highlight = "#2a2a27";
    temp.dark.secondaryButton = "#555";
    temp.dark.secondaryButtonHighlight = "#777";
    temp.dark.secondaryButtonText = "#ddd";
    temp.dark.primaryButton = "#453130";
    temp.dark.primaryButtonHighlight = "#523a39";
    temp.dark.primaryButtonText = "#eee";

    return temp; 
  } 
    else if( styleChoice == "camo"){
    temp.style = styleChoice;
    temp.light.mainTheme = "#6e5e49";
    temp.light.mainThemeStyled = `
linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)) 0 0 / 75px 100%,
radial-gradient(ellipse at center, #dad3c1 50%, transparent 50%) -50% 0 / 50% 100%,
radial-gradient(ellipse at center, #a49872 30%, transparent 30%) 0 -37.5px / 50% 100%,
radial-gradient(ellipse at center, #87735a 50%, transparent 50%) 0 -37.5px / 50% 100%,
linear-gradient(0deg, transparent 25%, #dad3c1 25%, #dad3c1 75%, transparent 75%),
linear-gradient(0deg, #87735a 25%, transparent 25%, transparent 75%, #87735a 75%),
radial-gradient(ellipse at center, #87735a 60%, #a49872 60%) -50% 0 / 50% 100%`;
    temp.light.backgroundMain = "#f5f2eb";
    temp.light.backgroundMainOutline = "#cfc8ba";
    temp.light.backgroundTint1 = "#f7f4ed";
    temp.light.backgroundTint1Highlight = "#fbf9f2";
    temp.light.backgroundTint2 = "#f9f7f0";
    temp.light.backgroundTint2Highlight = "#fdfbf4";
    temp.light.secondaryButton = "#d1c4ab";
    temp.light.secondaryButtonHighlight = "#e0d3b8";
    temp.light.secondaryButtonText = "#333";
    temp.light.primaryButton = "#636e48";
    temp.light.primaryButtonHighlight = "#7a8759";
    temp.light.primaryButtonText = "#eee";

    temp.dark.mainTheme = "#6e5e49";
    temp.dark.mainThemeStyled = `
linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)) 0 0 / 75px 100%,
radial-gradient(ellipse at center, #dad3c1 50%, transparent 50%) -50% 0 / 50% 100%,
radial-gradient(ellipse at center, #a49872 30%, transparent 30%) 0 -37.5px / 50% 100%,
radial-gradient(ellipse at center, #87735a 50%, transparent 50%) 0 -37.5px / 50% 100%,
linear-gradient(0deg, transparent 25%, #dad3c1 25%, #dad3c1 75%, transparent 75%),
linear-gradient(0deg, #87735a 25%, transparent 25%, transparent 75%, #87735a 75%),
radial-gradient(ellipse at center, #87735a 60%, #a49872 60%) -50% 0 / 50% 100%`;
    temp.dark.backgroundMain = "#0A0900";
    temp.dark.backgroundMainOutline = "#211c1c";
    temp.dark.backgroundTint1 = "#0d0c03";
    temp.dark.backgroundTint1Highlight = "#121108";
    temp.dark.backgroundTint2 = "#100f07";
    temp.dark.backgroundTint2Highlight = "#151411";

    temp.dark.secondaryButton = "#6e5e49";
    temp.dark.secondaryButtonHighlight = "#87735a";
    temp.dark.secondaryButtonText = "#d1d1d1";

    temp.dark.primaryButton = "#636e48";
    temp.dark.primaryButtonHighlight = "#7a8759";
    temp.dark.primaryButtonText = "#eee";


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

  // selectElement2 = document.getElementById('fontSelect');
  // selectElement2.addEventListener('change', function() {
  //     const selectedOption2 = selectElement2.value;
  //     if (selectedOption2 == "default") {
  //       var temp = initialiseUserData(userData.style);
  //       userData.light.globalFont = temp.light.globalFont;
  //       userData.dark.globalFont = temp.dark.globalFont;
  //     }
  //     else{
  //       userData.light.globalFont = selectedOption2;
  //       userData.dark.globalFont = selectedOption2;
  //     }
  //     refreshStyles();
  // });

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











