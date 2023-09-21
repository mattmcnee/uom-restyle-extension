function loadDeadlinesIfHomepage(){
  if (window.location.pathname === "/webapps/portal/execute/tabs/tabAction") {
    // On Blackboard homepage, so need to apply changes
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    // Load deadlines to where welcome image was originally

    const xhr = new XMLHttpRequest();
    const eventsUrl = `https://online.manchester.ac.uk/webapps/calendar/calendarData/selectedCalendarEvents?start=${Math.round((new Date()).getTime() / 1000)}`;
    xhr.open('GET', eventsUrl, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
      // Parse JSON for events
      const events = [];
      for (let i = 0; i < xhr.response.length; i++) {
        const event = xhr.response[i];
        if (event.id.indexOf('GradableItem') === -1) {
          // Not a deadline, so ignore calendar event
          continue;
        }
        let courseName = event.calendarName.split(' ');
        courseName = courseName.splice(0, courseName.length - 3).join(' ');
        events.push({
          uid: event.id,
          title: event.title,
          course: courseName,
          date: new Date(event.startDate),
          url: event.attemptable ? `https://online.manchester.ac.uk/webapps/calendar/launch/attempt/${event.id}` : null
        })
      }
      events.sort((a, b) => a.date - b.date);

      const now = new Date();
      now.setHours(now.getHours() + 1);
      // Append future deadlines to the page
      let items = [];
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const dayDiff = Math.round((event.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Add a condition to only include events less than 32 days away
        if (dayDiff < 32) {
          if (event.date < today) continue;
          if (event.date.toDateString() === today.toDateString()) {
            // Due today
            items.push(`<li><a href="${event.url}" style="color: ${now >= event.date ? 'red' : 'orange'}">
              <b>${event.course}</b><br>
              ${event.title}<br>
              <b>Today</b>, ${event.date.toLocaleString().substr(12, event.date.toLocaleString().length - 15) /* Exclude minutes from date */}
            </a></li>`);
          } else {
            // Not due today
            // TODO: support 'tomorrow'
            items.push(`<li>${event.url ? `<a href="${event.url}">`: ``}
              <b>${event.course}</b><br>
              ${event.title}<br>
              ${event.date.toLocaleString().substr(0, event.date.toLocaleString().length - 3) /* Exclude minutes from date */} (${dayDiff} days)
            ${event.url ? `</a>` : ``}</li>`);
          }
        }
      }
      fixedID = document.getElementById('$fixedId')
      if (fixedID) {
        fixedID.innerHTML = `<h3>Upcoming Deadlines</h3><ul class="listElement">${items.join('')}</ul>`;
      }
     // Now, 'events' contains the gradable calendar events.
    };
    xhr.send();
  }
}

function preloadDeadlinesIfHomepage(){
  if (window.location.pathname === "/webapps/portal/execute/tabs/tabAction") {
    if (!fixedID) {
      const fixedID = document.getElementById('$fixedId')
      if (fixedID) {
        fixedID.innerHTML = `<h3>Loading Upcoming Deadlines...</h3>`;
      }
    }
  }
}

// Converts JSON to root style element inner text
function getProperties(themeData) {
  const cssText = `
--main-theme: ${themeData.mainTheme};
--main-theme-styled: ${themeData.mainThemeStyled};
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

// Converts JSON to root style element using getProperties()
function getCss(themeData){
  const temp = getProperties(themeData);
  const cssText = `
:root { 
${temp}
}
  `;
  return cssText;
}

function updateTheme(uData, updateIframe){
  if (!uData) {  // Don't update theme if userData is undefined
    return 1;
  }

  if(uData.style == "stylesheet"){
    root.style.cssText = "";
    inlineCSS = getCss(uData.light) + inlineCSSCont;
  }
  else{
    if (uData.theme == "dark") {
      root.style.cssText = getProperties(uData.dark);
      inlineCSS = getCss(uData.dark) + inlineCSSCont;
      toxCSS = getCss(uData.dark) + toxCSSRoot;
      // console.log("Set dark: " + root.style.cssText);
    }
    else if (uData.theme == "light") {
      root.style.cssText = getProperties(uData.light);
      inlineCSS = getCss(uData.light) + inlineCSSCont;
      toxCSS = getCss(uData.light) + toxCSSRoot;
      // console.log("Set light: "+ root.style.cssText);
    }
    else{
      console.log("Called updateTheme when userData is not defined");
      return 1;
    }
  }

  if (updateIframe) {
    for (const iframe of iframes) {
      if (iframe !== null) {
        // console.log("Updating iframe");
        updateInlineStylesInIframe(iframe, inlineCSS);
      }
    }
    for (const iframe of toxFrames) {
      if (iframe !== null) {
        // console.log("Updating iframe");
        updateInlineStylesInIframe(iframe, toxCSS);
      }
    }
  }
}

if (navigator.userAgent.includes("Firefox")) {
  // console.log("This is Firefox.");
  browser.runtime.onMessage.addListener(function (message) {
    updateStyles(message)
  });
}
else if (navigator.userAgent.includes("Chrome")) {
  // console.log("This is Chrome.");
  chrome.runtime.onMessage.addListener(function (message) {
    updateStyles(message)
  });
}

function addStyles(iframeDocument, cssRules) {
  // Create a new <style> element for inline styles
  var styleElement = iframeDocument.createElement("style");
  styleElement.type = "text/css";
  styleElement.id = "injectedStyles";
  styleElement.appendChild(iframeDocument.createTextNode(cssRules)); // For modern browsers
  iframeDocument.head.appendChild(styleElement);

  // deals with iframe-ception
  var babyIframes = [
    iframeDocument.getElementById("right_stream_mygrades"),
    iframeDocument.getElementById("right_stream_stream")
  ]

  for (const iframe of babyIframes) {
    if (iframe !== null) {
      // console.log("Adding iframe" + iframe);
      addInlineStylesInIframe(iframe, inlineCSS);
      break;
    }
  }
}

function updateStyles(message){
  // Save data to storage
  var userData = message;
  if (navigator.userAgent.includes("Firefox")) {
    browser.storage.local.set({ userData: message });
    // console.log("Data saved:", message);
  } 
  else if (navigator.userAgent.includes("Chrome")) {
    chrome.storage.local.set({ userData}, () => {
      // console.log("Data saved:", message);
    });
  } 
  else {
    console.log("Browser currently unsupported");
  }
  updateTheme(userData, true);
}


// Adds CSS styles to iframes
function addInlineStylesInIframe(iframeElement, cssRules) {
  // Loads inner document
  var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;

  // // Checks if document is loaded yet and uses onload if not
  if(iframeDocument.location.origin == "null" || iframeElement.id == "right_stream_mygrades"){
    iframeElement.onload = function() {
      iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;
      addStyles(iframeDocument, cssRules);
    };
  }
  else{
    addStyles(iframeDocument, cssRules);
  }
}


// Updates CSS styles in iframes
function updateInlineStylesInIframe(iframeElement, cssRules) {
  // Loads inner document
  var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;

  var styleElement = iframeDocument.getElementById("injectedStyles");
  styleElement.textContent = cssRules;

  // deals with iframe-ception
  var babyIframes = [
    iframeDocument.getElementById("right_stream_mygrades"),
    iframeDocument.getElementById("right_stream_stream")
  ]

  for (const iframe of babyIframes) {
    if (iframe !== null) {
      console.log("Adding iframe");
      updateInlineStylesInIframe(iframe, cssRules);
      break;
    }
  }
}

// Called when MyBb chosen content changes
function refreshIframe(){
  for (const iframe of iframes) {
    if (iframe !== null) {
      addInlineStylesInIframe(iframe, inlineCSS);
    }
  }
}

// sets up handling of iframe styles
function setupIframeInjection(){
  iframes = [
    document.getElementById("mybbCanvas"),
    document.getElementById("right_stream_mygrades"),
    document.getElementById("contentFrame"),
    document.getElementById("orientationFrame")
  ];

  for (const iframe of iframes) {
    if (iframe !== null) {
      // console.log("Adding iframe" + iframe);
      addInlineStylesInIframe(iframe, inlineCSS);
    }
  }

  iframeSwitch = [
    document.querySelector('#BB-CORE_____overview-tool a'),
    document.querySelector('#StreamsOnMyBb_____MyStreamTool a'),
    document.querySelector('#AlertsOnMyBb_____AlertsTool a'),
    document.querySelector('#MyGradesOnMyBb_____MyGradesTool a'),
    document.querySelector('#calendar-mybb_____calendar-tool a')
  ];

  for (const iframe of iframeSwitch) {
    if (iframe !== null) {
      iframe.addEventListener('click', refreshIframe);
    }
  }
}

// This stops the outside blackboard environment page for urls in allowedHrefs
function checkWhitelistLink(anchor) {
  const href = anchor.getAttribute('href');
  const attr = anchor.getAttribute('onclick');

  if (
    href && allowedHrefs.some(allowedHref => href.includes(allowedHref)) &&
    attr && attr.startsWith('this.href=\'/webapps/blackboard/content/contentWrapper.jsp')
  ) {
    anchor.setAttribute('onclick', `this.href='${href}';`);
    anchor.setAttribute('target', '_blank');
    console.log("Whitelisted: " + href);
  }
}

// adds top margin to content panel to account for the height 
// of breadcrumbs on mobile
function useBreadcrumbHeight(entries) {
  for (const entry of entries) {
    if (entry.target.id === "breadcrumbs") {
      const height = entry.contentRect.height;
      const mainDiv = document.getElementById("contentPanel");
      if (mainDiv) {
        mainDiv.style.marginTop = (height + 10) + "px";
      }
      else{
        console.log("contentPanel not found");
      }
    }
  }
}


// Replaces "EvaluationKIT Course Evaluations" portlet with nav links
function replaceKitPortlet(){
  const kitPortlet = document.getElementById('module:_334_1');
  if (kitPortlet) {
    var kitTitle = kitPortlet.querySelector('.moduleTitle');
    if (kitTitle) {
        kitTitle.textContent = 'Navigation Links';
    }
    var kitContent = kitPortlet.querySelector('#ek-widget');
    if (kitContent) {
        kitContent.style.display = 'none';
    }

    var kitBody = kitPortlet.querySelector('.collapsible');
    
    // Create an unordered list
    var ul = document.createElement('ul');
    ul.classList.add('listElement');

    // Loop through the navHrefs array and create list items with anchor elements
    for (var i = 0; i < navHrefs.length; i++) {
      var linkData = navHrefs[i];
      var li = document.createElement('li');
      
      var link = document.createElement('a');
      link.href = linkData[0]; // URL
      link.textContent = linkData[1]; // Link text
      
      li.appendChild(link);
      ul.appendChild(li);
    }
    
    // Append the ul to the kitBody
    kitBody.appendChild(ul);
  }
}

function replaceLePortlet() {
  const lePortlet = document.getElementById('module:_422_1');
  if (lePortlet) {

    // Adds Font Awesome to the page for icons
    var faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(faLink);

    var leTitle = lePortlet.querySelector('.moduleTitle');
    if (leTitle) {
      leTitle.textContent = 'UoM Blackboard Restyle';
    }
    var leContent = lePortlet.querySelector('#div_422_1');
    if (leContent) {
      leContent.style.display = 'none';
    }
    var leBody = lePortlet.querySelector('.collapsible');
    if (leBody) {
    // Create a div element
    var customDiv = document.createElement('div');

    var leStartText = document.createTextNode('You are currently using UoM Blackboard Restyle. To open extension settings click the jigsaw icon (');
    var leEndText = document.createTextNode(') in the top right of the browser. Select "UoM Blackboard Restyle" to change the style. Select "Manage extensions" to disable this extension.');
    var puzzlePieceIcon = document.createElement('i');
    puzzlePieceIcon.classList.add('fas', 'fa-puzzle-piece');
    puzzlePieceIcon.style.opacity = '0.8';

    customDiv.appendChild(leStartText);
    customDiv.appendChild(puzzlePieceIcon);
    customDiv.appendChild(leEndText);
    
    // Append the custom div to leBody
    leBody.appendChild(customDiv);     
    }
  }
}

// Create a MutationObserver to watch for changes in the DOM
// Needed as tox elements don't load instantly
var toxFrames = [];
function observeAndStyleTox() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if any added nodes are iframes with the specified class
        const addedNodes = Array.from(mutation.addedNodes);
        for (const node of addedNodes) {
          if (node instanceof HTMLIFrameElement && node.classList.contains('tox-edit-area__iframe')) {
            addInlineStylesInIframe(node, toxCSS);
            toxFrames.push(node);
          }
        }
      }
    }
  });

  // Start observing the entire document
  observer.observe(document, { childList: true, subtree: true });
}

function fixBreadcrumbsResize(){
  const observerBread = new ResizeObserver(useBreadcrumbHeight);
  const breadcrumbs = document.getElementById("breadcrumbs");
  if (breadcrumbs) {
    observerBread.observe(breadcrumbs);
  }
}

function replaceAmpersand(){
  var element = document.getElementById("crumb_2");
  if (element) {
    var innerText = element.textContent.trim();
    element.textContent = innerText.replace(/&amp;/g, '&');
  }
}




// Function definitions end




const allowedHrefs = ['https://zoom.us/', 'https://piazza.com/', 'https://www.sli.do/', 'https://gitlab.cs.man.ac.uk/'];

const navHrefs = [ 
  ['https://studentadmin.manchester.ac.uk/CSPROD/signon.html', 'Student System'],
  ['https://timetables.manchester.ac.uk/', 'Timetable'],
  ['https://video.manchester.ac.uk/lectures/', 'Lecture Recordings'],
  ['https://www.exams.manchester.ac.uk/exam-timetable/', 'Exam Timetable'],
  ['https://studentadmin.manchester.ac.uk/psp/CSPROD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL', 'Grades'],
  ['https://www.library.manchester.ac.uk/', 'Library'],
  ['https://studentnet.cs.manchester.ac.uk/me/spotv2/spotv2.php', 'SPOT (CS Students)'],
  ['https://www.library.manchester.ac.uk/training/my-learning-essentials/', 'My Learning Essentials'],
  ['https://manchester.evaluationkit.com/', 'Evaluation Kit']];

//Retrieve data from storage
if (navigator.userAgent.includes("Chrome")) {
  chrome.storage.local.get(["userData"], (result) => {
    // console.log("Data retrieved:", result.userData);
    userData = result.userData;
  });
} 
else if (navigator.userAgent.includes("Firefox")) {
  browser.storage.local.get('userData').then((result) => {
    // console.log(result.userData);
    userData = result.userData;
  });
}

var iframes;
var root;
var fixedID;
loadDeadlinesIfHomepage();
document.addEventListener("DOMContentLoaded", function() {
  root = document.documentElement;
  updateTheme(userData, false);

  preloadDeadlinesIfHomepage(); // Pre-enters text for deadlines portlet
 
  setupIframeInjection(); // sets up handling of iframe styles

  replaceAmpersand(); // Fixes specific bug with text "&" symbol

  fixBreadcrumbsResize(); // Fixes resizing bug with mobile breadcrumbs bar

  observeAndStyleTox(); // Applies iframe styling to tox elements

  // Prevents having to click again on whitelisted pages
  document.querySelectorAll('a').forEach(checkWhitelistLink);

  // Replaces some portlets in home page
  replaceKitPortlet();
  replaceLePortlet();
});


var toxCSSRoot = `

html {
    background-color: var(--background-main) !important;
}

.mce-content-body.vtbegenerated.mceContentBody{
    background-color: var(--background-main) !important;
    color: var(--text-main) !important;
}

.mce-content-body.vtbegenerated.mceContentBody li{
    color: var(--text-main) !important;
}

`

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


/*
  ---
  ---
  --- iframe content -- copy to inlineCSS in content.js to see changes
  ---
  ---
*/

/* iframeBackgroundMain */
#dynamic_filters_alerts, #column_0, #column_1, #mybb_column_wrapper,
.stream_header, .locationPane, body, .stream_page_left .left_stream_wrapper,
#calendar_content, #outer_left_stream_alerts, #dynamic_filters_mygrades,
.mybb.filterBarHorizontal, .mybb.gradeTableNew .grades_header,
#settingsContainer_alerts, .breadcrumbs, .filterBarHorizontal #sortby {
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
#ical, #createeventbutton,
.ui-dialog-buttonset button:last-child{
  background-image: none !important;
  outline: none !important;
  border: none !important;
  background-color: var(--primary-button) !important;
  box-shadow: inset 0 0 0 2px var(--primary-button) !important;
  color: var(--primary-button-text) !important;
  border-radius: 2px !important;
  text-shadow: none !important;
}

/* iframePrimaryButton:hover */
#ical:hover, #createeventbutton:hover,
.ui-dialog-buttonset button:last-child:hover{
  background-color: var(--primary-button-highlight) !important;
}

/* iframeButtonSecondary */
.fc-button-main:not(.fc-button-img), .streamSettingButtons .genericButton,
.ui-dialog-buttonset button:first-child {
  background-image: none !important;
  outline: none !important;
  border: none !important;
  background-color: var(--secondary-button) !important;
  box-shadow: inset 0 0 0 2px var(--secondary-button) !important;
  color: var(--secondary-button-text) !important;
  border-radius: 2px !important;
  text-shadow: none !important;
}

/* iframeButtonSecondary:hover */
.fc-button-main:not(.fc-button-img):hover, .streamSettingButtons .genericButton:hover, 
.ui-dialog-buttonset button:first-child:hover{
  background-color: var(--secondary-button-highlight) !important;
  cursor: pointer;
}

.fc-header .fc-button-img{
  outline: none !important;
  border: none !important;
  background-image: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: var(--secondary-button-text) !important;
  text-shadow: none !important;
}

/* iframeTextMain */
.stream_left .stream_new_entry .stream_context,
.stream_left .announcementTitle, .stream_left .announcementBody,
#streamHeader_calendar .title-text,
.ui-datepicker-calendar td a, .ui-datepicker-header .ui-datepicker-title,
.fc-header-title, #calendarList h3, .margin-interact h3,
.calendar-list .calendar-item label, .stream_item .grade-value,
#filter_by_mygrades button.active, .title-date, .section-title,
.stream_show_more_data .extras, .stream_show_more_data .extras:after,
.stream_header h1 span, #settingsContainer_alerts label,
.stream_dynamic_filters_content h5, .current_filter,
.stream_settings h5, .filterBarHorizontal #sortby
{
  color: var(--text-main) !important;
  text-shadow: none !important;
}

/* iframeTextLight */
.stream_left :not(.stream_new_entry, .active_stream_item) .stream_context, 
.stream_left .stream_context_bottom,
.stream_left .stream_area_name,
.stream_left .stream_datestamp, .ui-datepicker-calendar th span,
.fc-border-separate .fc-widget-content .fc-day-number, .fc-widget-header,
#filter_by_mygrades button:not(.active), .stream_show_more_data,
#streamDetailHeaderRight .timestamp, #dynamic_filters_alerts li a.active{
  color: var(--text-light) !important;
  text-shadow: none !important;
}

/* iframeTextLink */
.active_stream_item .grade-value, .active_stream_item .stream_context,
.active_stream_item .stream_context_bottom, .active_stream_item .stream_area_name,
.ui-datepicker-calendar .ui-state-highlight, .fc-border-separate .fc-today .fc-day-number,
#streamDetailHeaderRight .context h2 a, #dynamic_filters_alerts li a,
#filter_type_all_alerts:before, #settingsContainer_alerts .streamSettingHelpLinks a,
#left_stream_alerts .inlineContextMenu a, .streamOverview-more-items a,
#streamDetailHeaderRightClickable a, .profile-card a, .stream_item a, #gotocourseobjectlink
{
  color: var(--text-link) !important;
}

/* iframeTertiaryButtonHighlight */
.calendar-list .calendar-name label:hover, #filter_by_mygrades button:not(.active):hover
{
  color: var(--text-link) !important;
}

.left_stream_wrapper .stream_left, .left_stream_wrapper .scrollbar_track{
  height: calc(100% - 140px) !important;
}

.left_stream_wrapper{
  height: 100% !important;
}

.stream_right{
  height: 100vh !important;
}

.stream_page_left .current-page .icon{
  display: none !important;
}

#stream_mygrades, #outer_left_stream_mygrades{
  height: 100vh;
}

/* Calendar */
#ical{
  margin-bottom: 20px !important;
}

.cal-nav{
  z-index: 1 !important;
}

.cal-nav li{
  position: relative !important;
  background-color: transparent !important;
  z-index: 1 !important;
  padding: 7px !important;
}

.cal-nav .active{
  background-color: var(--background-main-outline) !important;
  border: none !important;
/*  border: 1px solid var(--background-main-outline) !important;*/
  box-shadow: none !important;
}

.cal-nav li#agendaDay {
    background-position: center -83px !important;
}

.cal-nav li#agendaWeek {
    background-position: center -38px !important;
}

.cal-nav li#month {
    background-position: center 7px !important;
}

/* Create event */
.ui-dialog{
  background-color: var(--background-main) !important;
  border: 1px solid var(--background-main-outline) !important;
}

.ui-dialog .ui-dialog-titlebar{
  color: var(--text-main);
  background-color: transparent !important;
}

.ui-dialog input, .ui-dialog textarea{
  outline: none !important;
  border: 1px solid var(--background-main-outline) !important;
  background-color: var(--background-main) !important;
  color: var(--text-main) !important;
  border-radius: 4px !important;
}

.ui-dialog label{
  color: var(--text-main) !important;
}

.ui-dialog .axInfoForDatePicker{
  color: var(--text-light) !important;
}

.ui-dialog #axInfoForDatePickerId{
  border-bottom: none !important;
  color: var(--text-link) !important;
  text-decoration: none !important;
}

.ui-dialog #axInfoForDatePickerId:hover{
  text-decoration: underline !important;
}

#createeventbutton{
  position: relative !important;
}

#createeventbutton span{
  background-image: none !important;
}

#createeventbutton:after{
  content: "+";
  position: absolute;
  top: -1.5px;
  left: 4px;
  width: 100%;
  height: 100%;
  font-size: 30px;
  line-height: 30px;
  color: var(--primary-button-text);
  pointer-events: none;
}

.fc-agenda .fc-agenda-slots tr:not(.fc-minor) th{
  padding-right: 22px !important;
  position: relative;
}

.fc-agenda .fc-agenda-slots tr:not(.fc-minor) th:after{
  content: ":00";
  position: absolute;
  bottom: 2px;
  right: 3px;
}

.stream_header{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  z-index: 6 !important;
  position: relative;
}

.stream_page_left {
  border: none !important;
}

#streamHeader_calendar .title-text{
  text-shadow: none !important;
}

.left_stream_wrapper{
  border: none !important;
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
}

.ui-datepicker-calendar .ui-state-highlight{
  box-shadow: none !important;
}

.ui-datepicker-calendar .ui-state-active{
  box-shadow: none !important;
  color: var(--main-theme) !important;
  font-weight: bold !important;
}

.fc-border-separate .fc-today{
  background-color: transparent !important;
}

.fc-border-separate, .fc-border-separate th, .fc-border-separate td {
  border: 1px solid var(--background-main-outline) !important;
}

.fc-event-skin:hover {
  cursor: pointer;
}

/* Calendar days planner */
.fc-widget-header{
  border-bottom: none !important;
  height: 2px !important;
  padding: 0 !important;
}

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
  overflow-y: hidden !important;
}

/* 35px difference */
.fc-agenda-days .fc-widget-content div{
  height: calc(100vh - 125px) !important;
}

.fc-widget-header + div:hover{
  overflow-y: auto !important;
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

.calendar-list .calendar-name label:hover {
    background-color: transparent !important;
}

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
  color: var(--text-link) !important;
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

.stream_filterlinks_divider{
  border-left: none !important;
}

#dynamic_filters_mygrades{
  left: unset !important;
  right: 15px !important;
  top: unset !important;
  bottom: calc(-100vh + 181px) !important;
  height: calc(100vh - 203px) !important;
  border: 1px solid var(--background-main-outline) !important;
  box-shadow: none !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.stream_dynamic_filters .filter-content-wrapper .stream_dynamic_filters_content{
  height: calc(100vh - 203px) !important;
}

.stream_dynamic_filters .scrollbar_track{
  height: calc(100vh - 183px) !important;
}

.stream_list_filter{
  padding-top: 0 !important;
}

.stream_list_filter li {
  vertical-align: initial !important;
  margin-top: 15px !important;
}

#filter_by_mygrades button{
  box-shadow: none !important;
  border: none !important;
  background-color: transparent !important;
  margin-top: 10px !important;
}

#streamHeader_mygrades{
  position: relative !important;
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

.left_stream_wrapper .stream_item{
  background-color: var(--background-tint-1) !important;
}

.left_stream_wrapper .stream_item:hover{
  background-color: var(--background-tint-1-highlight) !important;
}

.left_stream_wrapper #left_stream_alerts .active_stream_item{
  background-color: var(--background-tint-2) !important;
}

.left_stream_wrapper #left_stream_alerts .active_stream_item:hover{
  background-color: var(--background-tint-2-highlight) !important;
}

.gradeTableNew .row .cell a{
  cursor: pointer;
  color: var(--text-link) !important;
}

.gradeTableNew .row .cell .eval-links input{
  cursor: pointer;
  color: var(--text-light) !important;
  text-decoration: none !important;
}

.gradeTableNew .row .cell .eval-links input:hover{
  color: var(--text-main) !important;
}

.left_stream_wrapper .stream_left{
  border-color: var(--background-main-outline) !important;
}

.mybb-column{
  border-left: none !important;
  box-shadow: none !important;
}

#mybb_column_wrapper #column_0{
  border-right: 1px solid var(--background-main-outline) !important;
}

.streamError{
  box-shadow: none !important;
  background-color: transparent !important;
}

.stream_header{
  box-shadow: none !important;
  border-color: var(--background-main-outline) !important;
}

#streamDetail{
  border-top: none !important;
}

#streamDetailHeaderRight .context{
  display: none !important;
} 

#streamDetailHeaderRight{
  position: relative;
  margin-bottom: 10px !important;
  min-height: 0 !important;
}

#streamDetailHeaderRight .timestamp{
  right: -3px !important;
  position: absolute;
  bottom: -10px;
  left: 10px;
}

.stream_right{
  box-shadow: none !important;
  border-left: 1px solid var(--background-main-outline) !important;
  height: 100vh !important;
}

#streamDetail{
  margin-bottom: 60px !important;
}

#streamDetail .detail-heading h2{
  word-break: initial !important;
}

.current_filter{
  border-left: none !important;
}

.stream_header{
  border-bottom: none !important;
}

#dynamic_filters_alerts li a{
  box-shadow: none !important;
  background-color: transparent !important;
  border: none !important;
}

#dynamic_filters_alerts li a.active{
  cursor: initial !important;
}

#filter_type_all_alerts{
  color: transparent !important;
  box-shadow: none !important;
  background-color: transparent !important;
  border: none !important;
  padding-left: 27px !important;
}

#filter_type_all_alerts:before{
  content: "Select All";
  position: absolute;
  left: 0;
  top: 0;
}

#left_stream_alerts{
  height: calc(100vh - 100px) !important;
}

#outer_left_stream_alerts{
  height: 100vh !important;
}

#left_stream_alerts + .scrollbar_track{
  height: calc(100vh - 100px) !important;
}

#dynamic_filters_alerts, #dynamic_filters_alerts .filter-content-wrapper,
#dynamic_filters_alerts .stream_dynamic_filters_content,
#dynamic_filters_alerts .scrollbar_track{
  height: calc(100vh - 130px) !important;
}

#streamHeader_alerts{
  border-right: 1px solid var(--background-main-outline) !important;
  padding-right: 0 !important;
}

#settingsContainer_alerts{
  border: 1px solid var(--background-main-outline) !important;
  box-shadow: none !important;
  top: 15px !important;
  right: 15px !important;
}

#left_stream_alerts .inlineContextMenu a{
  border-bottom: none !important;
}

#left_stream_alerts .inlineContextMenu a:hover{
  text-decoration: underline !important;
}

#streamHeader_calendar #dynamic_filters_alerts .filter-content-wrapper{
  height: unset !important;
}

#streamHeader_mygrades{
  border-bottom: 1px solid var(--background-main-outline) !important;
}

.due_date:after{
  box-shadow: none !important;
}

.ui-datepicker-next, .ui-datepicker-prev{
  outline: none !important;
  border: none !important;
  background-image: none !important;
  border-radius: 2px !important;
  text-shadow: none !important;
}

.ui-datepicker-next:hover, .ui-datepicker-prev:hover{
  cursor: pointer;
}

#streamHeader_calendar{
  border-right: 1px solid var(--background-main-outline) !important;
}

.stream_dynamic_filters li a{
  color: var(--text-main) !important;
}

.stream_dynamic_filters li a:hover{
  color: var(--text-link) !important;
}

.stream_list_filter li a{
  color: var(--text-light) !important;
}

.icaldialog{
  color: var(--text-main) !important;
}

ul.streamSettingHelpLinks{
  border-color: var(--background-main-outline);
}

.external-breadcrumbs .contentPaneWide {
  border-top: none !important;
}

.external-breadcrumbs .receipt, .external-breadcrumbs .contentPaneWide .receipt {
  color: var(--text-main) !important;
  background-color: transparent !important;
  margin-top: 10px !important;
}

.filterBarHorizontal ul li a{
  color: var(--text-light) !important;
  background-color: transparent !important;
}

.filterBarHorizontal ul li a.active,
.filterBarHorizontal ul li a:hover  {
  color: var(--text-main) !important;
}

.sorter select {
    border-width: initial !important;
    border-style: none !important;
    border-color: initial !important;
    border-image: initial !important;
    outline: none !important;
    border-radius: 5px !important;
}

#grades_wrapper .grade,
#grades_wrapper .activityType{
  color: var(--text-main) !important;
}

#grades_wrapper .itemCat,
#grades_wrapper .lastActivityDate{
  color: var(--text-light) !important;
}

.detail-heading {
  border-bottom: 1px solid var(--background-main-outline) !important;
}

.detail-heading h2 a{
  border-bottom: none !important;
}

.author a {
  text-decoration: none !important;
}

.stream_left .announcementBody div {
    background-color: transparent !important;
    border-radius: 6px;
    border-color: var(--background-main-outline) !important;
}

.ui-dialog span{
  color: var(--text-main) !important;
}

`;

var inlineCSS = inlineCSSRoot + inlineCSSCont;
var toxCSS = inlineCSSRoot + toxCSSRoot;