function initialiseUserData(){
  const temp = 
  {
    theme: "dark",
    power: "on",
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


// function loadCSSFile(file) {
//   const link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.type = "text/css";
//   link.href = chrome.runtime.getURL(file);
//   document.head.appendChild(link);
// }

// // Load content2.css
// // loadCSSFile("content2.css");

// document.addEventListener("DOMContentLoaded", function() {
//   // This code will run when the page begins to load
//   console.log("Page is starting to load...");
//   loadCSSFile("content2.css");

// });













// const jsonData = initialiseUserData();
// localStorage.setItem('data', JSON.stringify(jsonData));

// Retrieving data
const storedData = localStorage.getItem('data');
const userData = JSON.parse(storedData);
console.log(userData);
const root = document.documentElement;
if (userData.theme == "dark") {
  setProperties(userData.dark);
}
else{
  setProperties(userData.light);
}




// Retrieve data from storage
// chrome.storage.local.get(["userData"], (result) => {
//   console.log("Data retrieved:", result.userData);
//   userData = result.userData;
//   if (userData.theme == "dark") {
//     setProperties(userData.dark);
//   }
//   else{
//     setProperties(userData.light);
//   }
// });

function updateStyles(message){

  // Save data to storage
  // var userData = message;
  // chrome.storage.local.set({ userData}, () => {
  //   console.log("Data saved:", message);
  // });

  const jsonData = message;
  localStorage.setItem('data', JSON.stringify(jsonData));

  if (userData.theme == "dark") {
    setProperties(userData.dark);
  }
  else{
    setProperties(userData.light);
  }
}


function setProperties(themeData) {
  const cssText = `
    --main-theme: ${themeData.mainTheme};
    --background-main: ${themeData.backgroundMain};
    --background-main-outline: ${themeData.backgroundMainOutline};
    --background-tint-1: ${themeData.backgroundTint1};
    --background-tint-1-highlight: ${themeData.backgroundTint1Highlight};
    --background-tint-2: ${themeData.backgroundTint2};
    --background-tint-2-highlight: ${themeData.backgroundTint2Highlight};
    --secondary-button: ${themeData.secondaryButton};
    --secondary-button-highlight: ${themeData.secondaryButtonHighlight};
    --secondary-button-text: ${themeData.secondaryButtonText};
    --primary-button: ${themeData.primaryButton};
    --primary-button-highlight: ${themeData.primaryButtonHighlight};
    --primary-button-text: ${themeData.primaryButtonText};
    --text-main: ${themeData.textMain};
    --text-light: ${themeData.textLight};
    --global-font: ${themeData.globalFont};
  `;

  root.style.cssText = cssText;
}






// Get the document's root element


// Set the CSS variables using the root element's style property
// root.style.setProperty('--main-theme', 'blue');






console.log('Custom script injected');

// Function to add inline CSS rules inside the iframe
function addInlineStylesInIframe(iframeElement, cssRules) {
    iframeElement.onload = function() {
        // Loads inner document
        var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;
        console.log(iframeDocument);

        // Create a new <style> element for inline styles
        var styleElement = iframeDocument.createElement("style");
        styleElement.type = "text/css";
        styleElement.appendChild(iframeDocument.createTextNode(cssRules)); // For modern browsers
        iframeDocument.head.appendChild(styleElement);

        // deals with iframe-ception
        var iframe2 = iframeDocument.getElementById("right_stream_mygrades");
        console.log("iframe2 "+iframe2);
        if(iframe2 != null){
          console.log("added")
          addInlineStylesInIframe(iframe2, cssRules);
        }
    };
}

var inlineCSS = `

:root {  
  --main-theme: #5E0366;

  --background-main: #fff;

  --background-tint-1: #fbfbfb;

  --background-tint-1-highlight: #f4f4f4;

  --background-tint-2: #fefefe;

  --background-tint-2-highlight: #f7f7f7;

  --secondary-button: #dadada;

  --primary-button: #5E0366;

  --text-main: #000;

  --global-font: Arial, sans-serif;
/*  --global-font: Consolas, monospace;*/
}

*{
  font-family: var(--global-font) !important;
  outline: none !important;
}

html {
    background-color: var(--background-main) !important;
    color: var(--text-main) !important;
  }


/* Calendar */

.stream_header{
  background-color: #fff !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  z-index: 6 !important;
  position: relative;
}

.stream_page_left {
  border: none !important;

}

.left_stream_wrapper{
/*  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2) !important;*/
  border: none !important;
  background-color: #fff !important;
  z-index: 5 !important;
  box-shadow: none !important;
}

.ui-datepicker-calendar .ui-state-default{
  width: 30px !important;
  height: 20px !important;
  text-align: center !important;
  border: none !important;
  border-radius: 5px !important;
  background-color: #f0f0f0 !important;

}

.ui-datepicker-calendar td{
  padding: 3px 0 !important;
}

/*.ui-datepicker-calendar table {
    border-spacing: 2px;
    row-gap: 2px !important;
}*/

.fc-border-separate .fc-state-highlight{
  background-color: lightblue !important;
}

.calendar-item .label-color{
  border-radius: 6px !important;
  width: 20px !important;
  height: 20px !important;
  padding: 0 !important;
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}
.calendar-item input[type="checkbox"]{
  appearance: none;
  background-color: #eee;
  width: 10px;
  height: 10px;
  margin-top: 4.8px !important;
  margin-left: 4.8px !important;
  border-radius: 2px !important;
  cursor: pointer;
}

.calendar-item input[type="checkbox"]:after{
  content: '';
  position: absolute;
  background-color: #eee;
  width: 6px;
  height: 6px;
  top: 2px !important;
  left: 2px !important;
  border-radius: 1px !important;
  pointer-events: none;
  cursor: pointer;
}

.calendar-item input:checked[type="checkbox"]:after{
  background-color: #333;
}

.calendar-item label{
  border: none !important;
  padding-right: 20px !important;
}

.calendar-item .notch{
  display: none !important;
}

.colorPicker-palette{
  background-color: #fff !important;
}

.colorPicker-picker{
  position: absolute;
  right: 0 !important;
  top: -6px !important; 
  transform: rotateZ(45deg) scale(1.2);
}

#checkUncheckAll{
  margin-bottom: 10px !important;
}

#checkUncheckAll a{
  text-decoration: none !important;
  outline: none !important;
}

#ical{
  background-color: #5E0366 !important;
  background-image: none !important;
  box-shadow: inset 0 0 0 2px #5E0366 !important;
  border: none !important;
  border-radius: 5px !important;
  text-align: center;
  padding: 0.5625rem 1.125rem 0.625rem !important;
  text-shadow: none !important;
  color: white !important;
}

#ical:hover{
  color: #eee !important;
}

.fc-header button{
  background-image: none !important;
  background-color: #dadada;
  box-shadow: inset 0 0 0 2px #dadada !important;
  border: none !important;
  border-radius: 5px !important;
  text-align: center;
  padding: 0.5625rem 1.125rem 0.625rem !important;
}


/* grade breakdown */
#grades_wrapper div{
  border: none !important;
  box-shadow: none !important;
}

#grades_wrapper .sortable_item_row:nth-child(odd) {
  background-color: var(--background-tint-1) !important;
}

#grades_wrapper .sortable_item_row:nth-child(odd):hover {
  background-color: var(--background-tint-1-highlight) !important;
}

#grades_wrapper .sortable_item_row:nth-child(even) {
  background-color: var(--background-tint-2); !important;
}

#grades_wrapper .sortable_item_row:nth-child(even):hover {
  background-color: var(--background-tint-2-highlight) !important;
}

#grades_wrapper {
  margin-top: 70px !important;
  margin-bottom: 30px !important;
}

.grades_header{
  box-shadow: none !important;
  border-bottom: none !important;
}

#streamDetailRightColumn .detail-heading {
    border-bottom: none !important;
    padding-bottom: 0 !important;
}

#streamDetailRightColumn .detail-heading h2 a {
  border-bottom: none !important;
}

.filterBarHorizontal {
  width: calc(100% - 15px) !important;
}

.filterBarHorizontal li{
  height: 30px !important;
}

#filterby {
  padding: 15px 0 10px 10px !important;
}

.filterBarHorizontal ul li a {
  padding: 3px 5px !important;
  border-radius: 5px !important;
  border: none !important;
  outline: none !important;
}

.sorter select{
  border: none !important;
  outline: none !important;
  border-radius: 5px !important;
}

#streamDetail .receiptBarHorizontal {
  bottom: 0 !important;
  margin: 0 35px !important;
}

/* my marks */

#left_stream_mygrades .stream_item:nth-child(odd) {
  background-color: var(--background-tint-1) !important;
}

#left_stream_mygrades .stream_item:nth-child(odd):hover {
  background-color: var(--background-tint-1-highlight) !important;
}

#left_stream_mygrades .stream_item:nth-child(even) {
  background-color: var(--background-tint-2); !important;
}

#left_stream_mygrades .stream_item:nth-child(even):hover {
  background-color: var(--background-tint-2-highlight) !important;
}

.stream_item {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

.active_stream_item {
  border-bottom: 1px dashed #ccc !important;
}

/* Updates */
#streamHeader_alerts{
  padding: 0 5px 15px 5px !important;
}

#streamHeader_alerts h1{
  margin-top: 20px !important;
  margin-left: 10px !important;
}

#dynamic_filters_alerts{
  background-color: var(--background-main) !important;
}

#dynamic_filters_alerts a{
  text-decoration: none !important;
}

#left_stream_stream{
  padding-top: 20px !important;
}

#column_0, #column_1, #mybb_column_wrapper{
  background-color: var(--background-main);
}


`;

var iframe = document.getElementById("mybbCanvas");
var iframe2 = document.getElementById("right_stream_mygrades");
var iframe3 = document.getElementById("contentFrame");
var iframe4 = document.querySelector(".tox-edit-area__iframe");

console.log(iframe4);

if(iframe != null){
  addInlineStylesInIframe(iframe, inlineCSS);
}else{
  if(iframe2 != null){
    addInlineStylesInIframe(iframe2, inlineCSS);
  }
}
if(iframe3 != null){
  addInlineStylesInIframe(iframe3, inlineCSS);
}

if(iframe4 != null){
  addInlineStylesInIframe(iframe4, inlineCSS);
  console.log("Detected box");
}





