function initialiseUserData(){
  const temp = 
  {
    style: "default",
    theme: "dark",
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

function updateTheme(uData, updateIframe){
  console.log("Data retrieved:", uData);
  if(uData.style == "stylesheet"){
    root.style.cssText = "";
    inlineCSS = getCss(uData.light) + inlineCSSCont;
  }
  else{
    if (uData.theme == "dark") {
      root.style.cssText = getProperties(uData.dark);
      inlineCSS = getCss(uData.dark) + inlineCSSCont;
      console.log("set dark");
    }
    else{
      root.style.cssText = getProperties(uData.light);
      inlineCSS = getCss(uData.light) + inlineCSSCont;
    }
  }

  if (updateIframe) {
    for (const iframe of iframes) {
      if (iframe !== null) {
        updateInlineStylesInIframe(iframe, inlineCSS);
        break;
      }
    }
  }

}


function updateStyles(message){

  // Save data to storage
  var userData = message;
  chrome.storage.local.set({ userData}, () => {
    console.log("Data saved:", message);
  });

  // const jsonData = message;
  // localStorage.setItem('data', JSON.stringify(jsonData));

  updateTheme(userData, true);
}


function getProperties(themeData) {
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
--text-link: ${themeData.textLink};
--global-font: ${themeData.globalFont};
  `;
  return cssText;
}

function getCss(themeData){
  const temp = getProperties(themeData);
  const cssText = `
:root { 
${temp}
}
  `;
  return cssText;
}

// Function to add inline CSS rules inside the iframe
function addInlineStylesInIframe(iframeElement, cssRules) {
    iframeElement.onload = function() {
        // Loads inner document
        var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;
        // console.log(iframeDocument);

        // Create a new <style> element for inline styles
        var styleElement = iframeDocument.createElement("style");
        styleElement.type = "text/css";
        styleElement.id = "injectedStyles";
        styleElement.appendChild(iframeDocument.createTextNode(cssRules)); // For modern browsers
        iframeDocument.head.appendChild(styleElement);

        console.log(styleElement);

        // deals with iframe-ception
        var iframe2 = iframeDocument.getElementById("right_stream_mygrades");
        // console.log("iframe2 "+iframe2);
        if(iframe2 != null){
          // console.log("added")
          addInlineStylesInIframe(iframe2, cssRules);
        }
    };
}


// Function to add inline CSS rules inside the iframe
function updateInlineStylesInIframe(iframeElement, cssRules) {
  // Loads inner document
  var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;

  var styleElement = iframeDocument.getElementById("injectedStyles");
  styleElement.textContent = cssRules;

  // deals with iframe-ception
  var iframe2 = iframeDocument.getElementById("right_stream_mygrades");
  if(iframe2 != null){
    updateInlineStylesInIframe(iframe2, cssRules);
  }
}

console.log('Custom script injected');

//Retrieve data from storage
chrome.storage.local.get(["userData"], (result) => {
  // console.log("Data retrieved:", result.userData);
  userData = result.userData;
});

var iframes;
var root;
document.addEventListener("DOMContentLoaded", function() {
  // This code will run when the page begins to load
  root = document.documentElement;
  updateTheme(userData, false);

  iframes = [
    document.getElementById("mybbCanvas"),
    document.getElementById("right_stream_mygrades"),
    document.getElementById("contentFrame"),
    document.querySelector(".tox-edit-area__iframe")
  ];

  // console.log(inlineCSS, iframes);

  for (const iframe of iframes) {
    if (iframe !== null) {
      addInlineStylesInIframe(iframe, inlineCSS);
      break;
    }
  }
});


var inlineCSSRoot =`

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

`

var inlineCSSCont = `
*{
  font-family: var(--global-font) !important;
  outline: none !important;
}`+`



/* iframeBackgroundMain */
#dynamic_filters_alerts, #column_0, #column_1, #mybb_column_wrapper,
.stream_header, .locationPane, body{
  background-color: var(--background-main) !important;
}

/* iframeBackgroundTint1 */
#grades_wrapper .sortable_item_row:nth-child(odd),
#left_stream_mygrades .stream_item:nth-child(odd) {
  background-color: var(--background-tint-1) !important;
}

/* iframeBackgroundTint1Highlight */
#grades_wrapper .sortable_item_row:nth-child(odd):hover,
#left_stream_mygrades .stream_item:nth-child(odd):hover {
  background-color: var(--background-tint-1-highlight) !important;
}

/* iframeBackgroundTint2 */
#grades_wrapper .sortable_item_row:nth-child(even),
#left_stream_mygrades .stream_item:nth-child(even) {
  background-color: var(--background-tint-2) !important;
}

/* iframeBackgroundTint2Highlight */
#grades_wrapper .sortable_item_row:nth-child(even):hover,
#left_stream_mygrades .stream_item:nth-child(even):hover {
  background-color: var(--background-tint-2-highlight) !important;
}

/* iframePrimaryButton */
#ical{
  outline: none !important;
  border: none !important;
  background-image: none !important;
  background-color: var(--primary-button) !important;
  box-shadow: inset 0 0 0 2px var(--primary-button) !important;
  color: var(--primary-button-text) !important;
  border-radius: 2px !important;
  text-shadow: none !important;
}

/* iframePrimaryButton:hover */
#ical:hover{
  background-color: var(--primary-button-highlight) !important;
}

/* iframeButtonSecondary */
.ui-datepicker-next, .ui-datepicker-prev, .fc-header .fc-button-content{
  outline: none !important;
  border: none !important;
  background-image: none !important;
  background-color: var(--secondary-button) !important;
  box-shadow: inset 0 0 0 2px var(--secondary-button) !important;
  color: var(--secondary-button-text) !important;
  border-radius: 2px !important;
  text-shadow: none !important;
}

.ui-datepicker-next:hover, .ui-datepicker-prev:hover, .fc-header .fc-button-content:hover{
  background-color: var(--secondary-button-highlight) !important;
  cursor: pointer;
}

/* Calendar */

#calendar_content{
  background-color: var(--background-main) !important;
}


.stream_header{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  z-index: 6 !important;
  position: relative;
}

.stream_page_left {
  border: none !important;
}

 .cal-nav li{
  background-color: #fff !important;
 }

#streamHeader_calendar .title-text{
  color: var(--text-main) !important;
  text-shadow: none !important;
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
}

.ui-datepicker-calendar td a{
  padding: 3px 0 !important;
  background-color: var(--background-tint-1) !important;
  background-image: none !important;
  background-repeat: none !important;
  text-shadow: none !important;
  color: var(--text-main) !important;
}

.ui-datepicker-calendar .ui-state-highlight{
  box-shadow: none !important;
  color: var(--text-link) !important;
}

.ui-datepicker-calendar .ui-state-active{
  box-shadow: none !important;
  color: var(--main-theme) !important;
  font-weight: bold !important;
}

.ui-datepicker-calendar th span{
  color: var(--text-light) !important;
}

.ui-datepicker-header .ui-datepicker-title{
  color: var(--text-main) !important;
}



/*.ui-datepicker-calendar table {
    border-spacing: 2px;
    row-gap: 2px !important;
}*/

.fc-border-separate .fc-today{
  background-color: transparent; !important;
}

.fc-border-separate .fc-widget-content .fc-day-number{
  color: var(--text-light) !important;
}

.fc-border-separate .fc-today .fc-day-number{
  color: var(--text-link) !important;
}

.fc-border-separate, .fc-border-separate th, .fc-border-separate td {
  border: 1px solid var(--background-main-outline) !important;
}

.fc-header-title{
  color: var(--text-main) !important;
}

.fc-event-skin:hover {
  cursor: pointer;
}

#outer_left_stream_alerts{
  background-color: var(--background-main) !important;
}

/* Calendar days planner */
.fc-widget-header{
  border-bottom: none !important;
  height: 2px !important;
  padding: 0 !important;
  color: var(--text-light) !important;
}

/*.fc-header-left{
display: flex;
    align-items: center;
  }*/

.fc-header button{
  margin-top: 6px !important;
}

.fc-widget-header .fc-agenda-divider-inner {
  background-color: var(--background-main-outline) !important;
}

.fc-agenda-days .fc-agenda-axis, .fc-view-agendaWeek .fc-agenda-axis{
  border-right: none !important;
}

.fc-widget-header, .fc-widget-content{
  border-color: var(--background-main-outline) !important;
}

.fc-minor .fc-widget-header, .fc-minor .fc-widget-content {
  border-top: 1px solid var(--background-main-outline) !important;
}

.fc-widget-header + div{
  height: calc(100vh - 160px) !important;
}

/* 35px difference */
/*.fc-widget-content div:not(.fc-day-content, .fc-day-content div){
  height: calc(100vh - 125px) !important;
}*/

.fc-agenda-days .fc-widget-content div{
  height: calc(100vh - 125px) !important;
}


.fc-agenda .fc-agenda-axis {
  border-right: none !important;
}

.calendar-item .label-color{
  border-radius: 6px !important;
  width: 20px !important;
  height: 20px !important;
  padding: 0 !important;
  margin-top: 2px !important;
  margin-bottom: 2px !important;
  left: 1px !important;
  top: -1px !important;
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
  border: none !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  border-radius: 4px !important;
  margin-top: 10px !important;
}

.colorPicker-palette div{
  border-radius: 3px !important;
}

.colorPicker-palette input{
  border-radius: 3px !important;
  padding-left: 2px !important;
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
  text-align: center;
  padding: 0.5625rem 1.125rem 0.625rem !important;
}

#calendarList h3, .margin-interact h3{
  color: var(--text-main) !important;
  text-shadow: none !important;
}

.calendar-list .calendar-item label{
  color: var(--text-main) !important;
  text-shadow: none !important;
}

.calendar-list .calendar-name label:hover {
  color: var(--text-link) !important;
    background-color: transparent !important;
}

/*.fc-header button{
  background-image: none !important;
  background-color: #dadada;
  box-shadow: inset 0 0 0 2px #dadada !important;
  border: none !important;
  border-radius: 5px !important;
  text-align: center;
  padding: 0.5625rem 1.125rem 0.625rem !important;
}*/


/* grade breakdown */
#grades_wrapper div{
  border: none !important;
  box-shadow: none !important;
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

.stream_item {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

.active_stream_item {
  border-right: 1px dashed #ccc !important;
}


/* Updates */
#streamHeader_alerts{
  padding: 0 5px 15px 5px !important;
}

#streamHeader_alerts h1{
  margin-top: 20px !important;
  margin-left: 10px !important;
}

#dynamic_filters_alerts a{
  text-decoration: none !important;
}

#left_stream_stream{
  padding-top: 20px !important;
}

`;

var inlineCSS = inlineCSSRoot + inlineCSSCont;





