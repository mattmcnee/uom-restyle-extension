
function loadDeadlinesIfHomepage() {
  const homepagePath = "/webapps/portal/execute/tabs/tabAction";
  
  if (window.location.pathname === homepagePath) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const xhr = new XMLHttpRequest();
    const eventsUrl = `https://online.manchester.ac.uk/webapps/calendar/calendarData/selectedCalendarEvents?start=${Math.round(new Date().getTime() / 1000)}`;
    
    xhr.open('GET', eventsUrl, true);
    xhr.responseType = 'json';
    
    xhr.onload = () => {
      const events = xhr.response.filter(event => event.id.indexOf('GradableItem') !== -1);
      events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      const ulElement = document.createElement('ul');
      ulElement.classList.add('listElement');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      for (const event of events) {
        const dayDiff = Math.round((new Date(event.startDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff < 32 && new Date(event.startDate) >= today) {
          const liElement = document.createElement('li');
          const aElement = document.createElement('a');
          
          if (event.attemptable) {
            aElement.href = `https://online.manchester.ac.uk/webapps/calendar/launch/attempt/${event.id}`;
          } else {
            aElement.style.cursor = 'text'; // Set cursor to default for unattemptable events
          }
          // aElement.style.color = now >= new Date(event.startDate) ? 'red' : 'orange';
          aElement.classList.add('deadlineLink');

          const bElement = document.createElement('b');
          bElement.textContent = event.calendarName.split(' ').splice(0, event.calendarName.split(' ').length - 3).join(' ');
          
          const titleElement = document.createTextNode(event.title);
          const dateText = (new Date(event.startDate).toDateString() === today.toDateString()) ? 'Today' : new Date(event.startDate).toLocaleString().substr(0, new Date(event.startDate).toLocaleString().length - 3) + ` (${dayDiff} days)`;
          
          aElement.appendChild(bElement);
          aElement.appendChild(document.createElement('br'));
          aElement.appendChild(titleElement);
          aElement.appendChild(document.createElement('br'));

          if (dateText === 'Today') {
            const bElement2 = document.createElement('b');
            bElement2.textContent = dateText;
            aElement.appendChild(bElement2);
            aElement.appendChild(document.createTextNode(`, ${new Date(event.startDate).toLocaleString().substr(12, new Date(event.startDate).toLocaleString().length - 15)}`));
          } else {
            aElement.appendChild(document.createTextNode(dateText));
          }
          
          liElement.appendChild(aElement);
          ulElement.appendChild(liElement);
        }
      }
      fixedID = document.getElementById('$fixedId');
      if (fixedID) {
        // Clear existing content
        while (fixedID.firstChild) {
          fixedID.removeChild(fixedID.firstChild);
        }

        fixedID.appendChild(document.createElement('h3')).textContent = 'Upcoming Deadlines';
        fixedID.appendChild(ulElement);
      }
    };

    xhr.send();
  }
}



function preloadDeadlinesIfHomepage(){
  if (window.location.pathname === "/webapps/portal/execute/tabs/tabAction") {
    if (!fixedID) {
      const fixedID = document.getElementById('$fixedId')
      if (fixedID) {
        while (fixedID.firstChild) {
          fixedID.removeChild(fixedID.firstChild);
        }
        fixedID.appendChild(document.createElement('h3')).textContent = 'Loading Upcoming Deadlines...';
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
  if(!iframeDocument.getElementById("injectedStyles")){

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

    // console.log(iframeDocument);
    // console.log(babyIframes);

    let runCount = 0;

    function fillBabyIframes() {
      if (runCount < 10) {
        for (const iframe of babyIframes) {
          if (iframe !== null) {
            addInlineStylesInIframe(iframe, inlineCSS);
            break;
          }
        }
        runCount++;
      }
    }

    // Hacky solution to style loading issue
    fillBabyIframes();
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
  // console.log("added styles to iframe");
  // Checks if document is loaded yet and uses onload if not
    addStyles(iframeDocument, cssRules);
    iframeElement.onload = function() {
      iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;
      addStyles(iframeDocument, cssRules);
    };
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
      // console.log("Adding iframe");
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
    // console.log("Whitelisted: " + href);
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
function replaceKitPortlet() {
  const portletColumn0 = document.getElementById("column0");
  if (portletColumn0) {
  forceDisplayNoneById("module:_334_1");

  // Create new portlet
  const kitPortlet = document.createElement("div");
  kitPortlet.classList.add("portlet", "clearfix");

  // Add the header
  const h2Element = document.createElement("h2");
  h2Element.className = "clearfix";
  const spanElement = document.createElement("span");
  spanElement.className = "moduleTitle";
  spanElement.textContent = "Navigation Links";
  h2Element.appendChild(spanElement);
  kitPortlet.appendChild(h2Element);

  const kitBody = document.createElement("div");
  kitBody.classList.add("collapsible");

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
  kitPortlet.appendChild(kitBody);

  var firstChild = portletColumn0.firstChild.nextSibling.nextSibling;
  portletColumn0.insertBefore(kitPortlet, firstChild);
  }
}


function replaceLePortlet() {
  const portletColumn0 = document.getElementById("column0");
  if (portletColumn0) {
    forceDisplayNoneById("module:_422_1");

    var faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(faLink);

    // Create new portlet
    const kitPortlet = document.createElement("div");
    kitPortlet.classList.add("portlet", "clearfix");

    // Add the header
    const h2Element = document.createElement("h2");
    h2Element.className = "clearfix";
    const spanElement = document.createElement("span");
    spanElement.className = "moduleTitle";
    spanElement.textContent = "UoM Blackboard Restyle";
    h2Element.appendChild(spanElement);
    kitPortlet.appendChild(h2Element);

    const kitBody = document.createElement("div");
    kitBody.classList.add("collapsible");

    var customDiv = document.createElement('div');

    var leStartText = document.createTextNode('To open extension settings click the jigsaw icon (');
    var leEndText = document.createTextNode(') in the top right of the browser. Select "UoM Blackboard Restyle" to change the style. Select "Manage extensions" to disable this extension.');
    var puzzlePieceIcon = document.createElement('i');
    puzzlePieceIcon.classList.add('fas', 'fa-puzzle-piece');
    puzzlePieceIcon.style.opacity = '0.8';

    var webLink = document.createElement('a');
    webLink.href = "https://uom-blackboard-restyle.web.app/feedback.html";
    webLink.textContent = "here."; // Text for the link
    var linkText = document.createTextNode(' To give feedback or request a new feature, click ');


    var artLink = document.createElement('a');
    artLink.href = "https://icons8.com/";
    artLink.textContent = "Icons8.";
    var artText = document.createTextNode(', with icons by ');

    var autLink = document.createElement('a');
    autLink.href = "https://mattmcneedev.web.app/";
    autLink.textContent = "MattM Web Dev";
    var autText = document.createTextNode('UoM Blackboard Restyle is designed by ');



    customDiv.appendChild(leStartText);
    customDiv.appendChild(puzzlePieceIcon);
    customDiv.appendChild(leEndText);
    customDiv.appendChild(document.createElement('hr'));
    customDiv.appendChild(autText);
    customDiv.appendChild(autLink);
    customDiv.appendChild(artText);
    customDiv.appendChild(artLink);



    customDiv.appendChild(linkText);
    customDiv.appendChild(webLink);

    // Append the custom div and link to leBody
    kitBody.appendChild(customDiv);

    // Append the ul to the kitBody
    kitPortlet.appendChild(kitBody);

    var firstChild = portletColumn0.firstChild.nextSibling.nextSibling;
    portletColumn0.appendChild(kitPortlet);
  }
}

function forceDisplayNoneById(divID){
  var divToMonitor = document.getElementById(divID);
  if (divToMonitor) {
    divToMonitor.style.display = "none";
    // Create a MutationObserver
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
                // Check if the style attribute has changed
                var currentDisplayStyle = divToMonitor.style.display;
                if (currentDisplayStyle !== "none") {
                    // If it has changed to something other than "none", set it back to "none"
                    divToMonitor.style.display = "none";
                }
            }
        });
    });
  }
  // Configure the observer to watch for changes to the style attribute
  var config = { attributes: true, attributeFilter: ["style"] };
  observer.observe(divToMonitor, config);
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
    element.textContent = innerText.replace(/&amp;/g, '&').replace(/<i>|<\/i>/g, '');
  }
  var pageTitle = document.title;
  document.title = pageTitle.replace(/&amp;/g, '&').replace(/<i>|<\/i>/g, '');
}




// Function definitions end




const allowedHrefs = [
  'https://zoom.us/', 
  'https://piazza.com/', 
  'https://www.sli.do/', 
  'https://gitlab.cs.man.ac.uk/',
  'https://web.cs.manchester.ac.uk/'];

const navHrefs = [ 
  ['https://studentadmin.manchester.ac.uk/CSPROD/signon.html', 'Student System'],
  ['https://timetables.manchester.ac.uk/timetables?view=week', 'Timetable'],
  ['https://video.manchester.ac.uk/lectures/', 'Lecture Recordings'],
  ['https://app.kortext.com/identity/different-account/institution', 'Textbook Library (Kortext)'],
  ['https://www.exams.manchester.ac.uk/exam-timetable/', 'Exam Timetable'],
  ['https://studentadmin.manchester.ac.uk/psp/CSPROD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL', 'Grades'],
  ['https://www.library.manchester.ac.uk/resources/', 'UoM Library'],
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
  replaceLePortlet();
  replaceKitPortlet();

  // UoM footer
  replaceImagesWithSVG("Address icon", svgIcons.marker);
  replaceImagesWithSVG("Phone icon", svgIcons.phone);
  replaceImagesWithSVG("Email Icon", svgIcons.email);

  replaceImagesWithSVG("Blackboard Learn", svgIcons.blackboard);
  replaceImagesWithSVG("File", svgIcons.document);


  replaceModuleImagesWithSVG(imageReplacementParams, "item_icon");
});


function replaceModuleImagesWithSVG(svgList, imgClass){
  var imgs = document.querySelectorAll(`img.${imgClass}`);
  imgs.forEach(function(image) {
    var altText = image.getAttribute('alt');
    var unchanged = true;
    for (var i = 0; i < svgList.length; i++) {
      if (altText == svgList[i][0]) {
          var svgElement = new DOMParser().parseFromString(svgList[i][1], 'image/svg+xml').documentElement;
          svgElement.classList.add(imgClass);
          svgElement.classList.add(altText.replace(/\s/g, ''));
          image.parentNode.replaceChild(svgElement, image);
          unchanged = false;
      }
    }
    if (unchanged) {
        var svgElement = new DOMParser().parseFromString(svgIcons.document, 'image/svg+xml').documentElement;
        svgElement.classList.add(imgClass);
        svgElement.classList.add(altText.replace(/\s/g, ''));
        image.parentNode.replaceChild(svgElement, image);
    }
  });
}



function replaceImagesWithSVG(targetAltText, svgCode) {
    // Find all images with the specified alt attribute
    var imagesToReplace = document.querySelectorAll('img[alt="' + targetAltText + '"]');

    // Replace each image with the SVG code
    imagesToReplace.forEach(function(image) {
        // Check if the image has the class "item_icon"
        if (targetAltText == "File"){
            var svgElement = new DOMParser().parseFromString(svgCode, 'image/svg+xml').documentElement;
            svgElement.style.height = "13px";
            svgElement.style.width = "15px";
            image.parentNode.replaceChild(svgElement, image);          
        }
        else if (targetAltText == "Address icon" || targetAltText == "Phone icon" || targetAltText == "Email Icon"){
            var svgElement = new DOMParser().parseFromString(svgCode, 'image/svg+xml').documentElement;
            svgElement.style.height = "20px";
            svgElement.style.width = "21px";
            svgElement.style.verticalAlign = "middle";
            svgElement.style.margin = "0 5px";
            image.parentNode.replaceChild(svgElement, image);          
        }
        else if (targetAltText == "Blackboard Learn" && image.parentNode.classList.contains("logo")) {
            var svgElement = new DOMParser().parseFromString(svgCode, 'image/svg+xml').documentElement;
            svgElement.style.position = "relative";
            svgElement.style.clear = "both";
            svgElement.style.left = "-12px";
            svgElement.style.top = "-72px";
            svgElement.style.width = "150px";
            image.parentNode.replaceChild(svgElement, image);          
        }
    });
}



// var power = document.getElementById("topframe.logout.label");
// var svgString = svgIcons.power; // Assuming svgIcons.power contains your SVG string
// var parser = new DOMParser();
// var svgElement = parser.parseFromString(svgString, "image/svg+xml").documentElement;
// power.parentNode.replaceChild(svgElement, power);

const iconColor = "#656565";


const svgIcons = 
  {
  folder: 
`<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 24 24" fill="${iconColor}">
  <path d="M 4 4 C 2.9057453 4 2 4.9057453 2 6 L 2 18 C 2 19.094255 2.9057453 20 4 20 L 20 20 C 21.094255 20 22 19.094255 22 18 L 22 8 C 22 6.9057453 21.094255 6 20 6 L 12 6 L 10 4 L 4 4 z M 4 6 L 9.171875 6 L 11.171875 8 L 20 8 L 20 18 L 4 18 L 4 6 z"></path>
</svg>`,
  link: `
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M185 855 l-25 -24 0 -351 0 -351 25 -24 c23 -24 30 -25 140 -25 l115
0 0 40 0 40 -100 0 -100 0 0 320 0 320 140 0 140 0 0 -100 0 -100 100 0 100 0
0 -59 0 -60 40 17 40 17 0 65 0 65 -118 118 -117 117 -178 0 c-176 0 -178 0
-202 -25z"/>
<path d="M800 434 c-8 -4 -34 -25 -57 -47 l-43 -41 27 -28 27 -28 -42 -42 -42
-42 -28 27 -28 27 -44 -45 c-41 -42 -45 -50 -45 -95 0 -71 44 -115 115 -115
45 0 53 4 95 45 l45 44 -27 28 -27 28 42 42 42 42 28 -27 28 -27 44 45 c41 42
45 50 45 95 0 42 -5 54 -31 81 -31 30 -90 46 -124 33z m68 -86 c20 -20 14 -43
-23 -78 l-35 -34 -27 27 -27 27 34 35 c35 37 58 43 78 23z m-168 -173 l24 -25
-34 -35 c-19 -19 -41 -35 -50 -35 -20 0 -40 19 -40 39 0 15 58 81 70 81 4 0
17 -11 30 -25z"/>
</g>
</svg>`,
  assignment: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M434 911 c-11 -5 -32 -23 -47 -40 -25 -31 -27 -31 -122 -31 -89 0
-98 -2 -120 -25 l-25 -24 0 -311 0 -311 25 -24 24 -25 311 0 311 0 24 25 25
24 0 311 0 311 -25 24 c-22 23 -32 25 -119 25 l-96 0 -32 36 c-35 38 -92 53
-134 35z m80 -93 c8 -13 8 -23 -2 -38 -12 -20 -10 -20 118 -20 l130 0 0 -280
0 -280 -280 0 -280 0 0 280 0 280 132 0 c103 0 129 3 120 12 -26 26 -4 71 32
66 10 -2 24 -11 30 -20z"/>
<path d="M582 664 c-30 -21 -28 -34 13 -74 l35 -34 27 27 27 27 -34 35 c-39
40 -38 40 -68 19z"/>
<path d="M397 482 c-112 -113 -117 -119 -117 -160 0 -42 0 -42 38 -42 35 0 46
9 162 125 l124 125 -34 35 c-19 19 -39 35 -45 35 -6 0 -63 -53 -128 -118z"/>
</g>
</svg>`,
group:`
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M412 780 c-68 -42 -91 -124 -52 -188 41 -66 113 -88 179 -54 101 51
106 183 9 242 -18 11 -49 20 -68 20 -19 0 -50 -9 -68 -20z m108 -80 c11 -11
20 -29 20 -40 0 -26 -34 -60 -60 -60 -11 0 -29 9 -40 20 -11 11 -20 29 -20 40
0 11 9 29 20 40 11 11 29 20 40 20 11 0 29 -9 40 -20z"/>
<path d="M131 666 c-87 -48 -50 -186 49 -186 51 0 100 49 100 99 0 75 -83 124
-149 87z m74 -86 c0 -18 -6 -26 -23 -28 -24 -4 -38 18 -28 44 3 9 15 14 28 12
17 -2 23 -10 23 -28z"/>
<path d="M731 666 c-87 -48 -50 -186 49 -186 51 0 100 49 100 99 0 75 -83 124
-149 87z m74 -86 c0 -18 -6 -26 -23 -28 -13 -2 -25 3 -28 12 -10 26 4 48 28
44 17 -2 23 -10 23 -28z"/>
<path d="M375 427 c-28 -7 -57 -17 -65 -22 -8 -5 -55 -10 -105 -10 -72 -1 -98
-5 -132 -23 -61 -32 -73 -54 -73 -139 l0 -73 480 0 480 0 0 73 c0 85 -12 107
-73 139 -33 18 -60 23 -127 23 -54 1 -103 8 -135 19 -65 23 -186 29 -250 13z
m206 -83 c77 -22 99 -39 99 -74 l0 -30 -200 0 -200 0 0 29 c0 36 15 48 87 71
72 23 143 25 214 4z m-381 -64 l0 -40 -60 0 c-52 0 -60 3 -60 18 0 33 41 60
93 61 25 1 27 -2 27 -39z m661 14 c10 -9 19 -25 19 -36 0 -15 -8 -18 -60 -18
l-60 0 0 41 0 42 41 -6 c22 -3 49 -13 60 -23z"/>
</g>
</svg>`,
tools: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M156 801 l-38 -39 31 -46 c36 -52 66 -76 96 -76 12 0 49 -29 90 -70
l69 -70 -122 -123 c-141 -143 -146 -155 -83 -218 61 -61 76 -56 197 63 l104
102 104 -102 c121 -119 136 -124 197 -63 61 61 56 76 -63 197 l-102 104 28 29
c20 21 40 30 73 34 78 8 133 65 140 144 2 26 -1 55 -6 63 -9 12 -14 10 -38
-12 -37 -36 -83 -27 -95 17 -6 24 -3 34 20 58 22 24 24 29 12 38 -8 5 -37 8
-63 6 -79 -7 -136 -62 -144 -140 -5 -38 -14 -53 -54 -93 l-49 -48 -70 69 c-41
41 -70 78 -70 90 0 29 -24 60 -75 95 -24 16 -45 30 -47 30 -2 0 -21 -18 -42
-39z m525 -86 c13 -52 20 -59 77 -74 23 -7 42 -16 42 -21 0 -16 -57 -40 -97
-40 -36 0 -48 -10 -238 -200 l-201 -201 -22 24 -21 23 199 199 c190 190 200
202 200 238 0 40 24 97 40 97 5 0 15 -20 21 -45z m7 -398 l93 -93 -24 -22 -23
-22 -94 95 c-93 93 -94 94 -75 115 10 11 21 20 24 20 4 0 48 -42 99 -93z"/>
</g>
</svg>`,
document:`<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 24 24" fill="${iconColor}">
<path d="M 6 2 C 4.9057453 2 4 2.9057453 4 4 L 4 20 C 4 21.094255 4.9057453 22 6 22 L 18 22 C 19.094255 22 20 21.094255 20 20 L 20 8 L 14 2 L 6 2 z M 6 4 L 13 4 L 13 9 L 18 9 L 18 20 L 6 20 L 6 4 z"></path>
</svg>`,
minLink: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">
</svg>`,
test: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M434 911 c-11 -5 -32 -23 -47 -40 -25 -31 -27 -31 -122 -31 -89 0
-98 -2 -120 -25 l-25 -24 0 -311 0 -311 25 -24 24 -25 311 0 311 0 24 25 25
24 0 311 0 311 -25 24 c-22 23 -32 25 -119 25 l-96 0 -32 36 c-35 38 -92 53
-134 35z m80 -93 c8 -13 8 -23 -2 -38 -12 -20 -10 -20 118 -20 l130 0 0 -280
0 -280 -280 0 -280 0 0 280 0 280 132 0 c103 0 129 3 120 12 -26 26 -4 71 32
66 10 -2 24 -11 30 -20z"/>
<path d="M625 640 c-30 -31 -47 -40 -72 -40 -32 0 -33 -1 -33 -40 l0 -40 48 0
c44 0 51 4 100 53 l52 53 -28 27 -28 27 -39 -40z"/>
<path d="M280 560 l0 -40 80 0 80 0 0 40 0 40 -80 0 -80 0 0 -40z"/>
<path d="M625 440 c-30 -31 -47 -40 -72 -40 -32 0 -33 -1 -33 -40 l0 -40 48 0
c44 0 51 4 100 53 l52 53 -28 27 -28 27 -39 -40z"/>
<path d="M280 360 l0 -40 80 0 80 0 0 40 0 40 -80 0 -80 0 0 -40z"/>
</g>
</svg>`,
extLink: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 24 24" fill="${iconColor}">
<path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"></path>
</svg>`,
chat:`<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M105 815 l-25 -24 0 -255 0 -255 57 60 56 59 64 0 63 0 0 -75 c0 -67
3 -79 25 -100 24 -25 25 -25 223 -25 l199 0 56 -59 57 -60 0 255 0 255 -25 24
c-22 23 -32 25 -120 25 l-95 0 0 75 c0 67 -3 79 -25 100 l-24 25 -231 0 -231
0 -24 -25z m455 -195 l0 -140 -200 0 -200 0 0 140 0 140 200 0 200 0 0 -140z
m240 -200 l0 -140 -200 0 -200 0 0 60 0 60 95 0 c88 0 98 2 120 25 21 20 25
34 25 80 l0 55 80 0 80 0 0 -140z"/>
</g>
</svg>`,
power:`<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="36.000000pt" height="36.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M451 866 c-8 -9 -11 -69 -9 -191 3 -157 5 -179 20 -189 13 -8 23 -8
35 0 16 10 18 32 21 189 3 183 -1 205 -38 205 -10 0 -23 -6 -29 -14z"/>
<path d="M305 753 c-54 -28 -123 -104 -152 -167 -24 -52 -28 -74 -28 -146 0
-72 4 -94 28 -146 36 -77 104 -145 182 -181 51 -24 73 -28 145 -28 72 0 94 4
146 28 77 36 145 104 181 182 24 51 28 73 28 145 0 72 -4 94 -28 145 -48 104
-162 199 -207 175 -28 -15 -25 -46 6 -67 96 -67 141 -134 151 -226 17 -161
-115 -307 -277 -307 -118 0 -234 85 -266 195 -38 134 8 247 140 338 31 21 34
52 7 67 -24 12 -19 13 -56 -7z"/>
</g>
</svg>
`,
wiki:`
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M145 815 l-25 -24 0 -311 0 -311 25 -24 24 -25 311 0 311 0 24 25 25
24 0 311 0 311 -25 24 -24 25 -311 0 -311 0 -24 -25z m615 -335 l0 -280 -280
0 -280 0 0 280 0 280 280 0 280 0 0 -280z"/>
<path d="M280 640 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z"/>
<path d="M280 480 l0 -40 120 0 120 0 0 40 0 40 -120 0 -120 0 0 -40z"/>
<path d="M280 320 l0 -40 200 0 200 0 0 40 0 40 -200 0 -200 0 0 -40z"/>
</g>
</svg>
`,
phone:`<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M130 825 c-32 -39 19 -257 87 -374 49 -83 151 -185 234 -234 117 -68
335 -119 374 -87 20 16 22 182 3 198 -7 5 -35 12 -63 15 -27 3 -69 9 -93 13
-42 7 -45 5 -93 -42 l-49 -48 -38 19 c-48 26 -181 159 -207 207 l-19 38 48 49
c47 48 49 51 42 93 -4 24 -10 66 -13 93 -3 28 -10 56 -15 63 -16 19 -182 17
-198 -3z"/>
</g>
</svg>`,
email:`<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M105 775 l-25 -24 0 -271 0 -271 25 -24 24 -25 351 0 351 0 24 25 25
24 0 271 0 271 -25 24 -24 25 -351 0 -351 0 -24 -25z m693 -77 c-2 -15 -46
-48 -161 -120 l-157 -98 -158 98 c-114 72 -158 105 -160 120 l-3 22 321 0 321
0 -3 -22z m-400 -247 l82 -51 83 51 c45 29 117 74 160 101 l77 48 0 -180 0
-180 -320 0 -320 0 0 180 0 180 78 -48 c42 -27 114 -72 160 -101z"/>
</g>
</svg>`,
marker:`<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="96.000000pt" height="96.000000pt" viewBox="0 0 96.000000 96.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M410 871 c-86 -28 -141 -74 -181 -151 -34 -65 -32 -171 4 -257 49
-120 216 -368 247 -368 31 0 198 248 247 368 38 89 38 192 1 262 -31 60 -67
95 -128 125 -48 24 -147 35 -190 21z m134 -83 c86 -26 147 -127 132 -219 -4
-22 -20 -70 -36 -106 -30 -65 -148 -253 -160 -253 -12 0 -130 188 -160 253
-38 85 -46 135 -29 194 30 107 140 164 253 131z"/>
<path d="M431 686 c-87 -48 -50 -186 49 -186 51 0 100 49 100 99 0 75 -83 124
-149 87z"/>
</g>
</svg>`,
blackboard:`<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="458.000000pt" height="149.000000pt" viewBox="0 0 458.000000 149.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,149.000000) scale(0.100000,-0.100000)"
fill="${iconColor}" stroke="none">
<path d="M885 1007 c-3 -7 -4 -125 -3 -262 l3 -250 43 -3 42 -3 0 265 0 266
-40 0 c-24 0 -43 -5 -45 -13z"/>
<path d="M1800 755 l0 -266 43 3 42 3 3 56 c2 44 8 61 26 78 l24 22 57 -80
c56 -81 57 -81 101 -81 24 0 44 5 44 10 0 6 -32 58 -72 115 l-72 105 74 75 74
75 -55 0 -56 0 -69 -77 -69 -77 -5 149 -5 150 -42 3 -43 3 0 -266z"/>
<path d="M2195 1007 c-3 -7 -4 -125 -3 -262 l3 -250 43 -3 c39 -3 42 -2 42 23
l0 25 40 -26 c34 -23 48 -26 98 -22 103 7 162 77 162 191 0 72 -17 114 -63
154 -61 53 -148 56 -207 7 l-30 -26 0 101 0 101 -40 0 c-24 0 -43 -5 -45 -13z
m244 -221 c65 -34 70 -160 7 -201 -81 -53 -177 15 -163 116 11 80 85 121 156
85z"/>
<path d="M3977 1013 c-4 -3 -7 -46 -7 -95 l0 -89 -30 21 c-43 31 -100 36 -155
15 -138 -52 -154 -266 -26 -352 48 -32 125 -32 174 1 l36 25 3 -22 c2 -18 11
-23 46 -25 l42 -3 0 265 0 266 -38 0 c-21 0 -42 -3 -45 -7z m-58 -227 c53 -28
70 -129 30 -180 -22 -28 -70 -45 -106 -38 -33 6 -72 49 -79 88 -19 101 69 174
155 130z"/>
<path d="M4114 1006 c-20 -15 -13 -43 12 -53 10 -4 22 1 30 11 24 33 -9 66
-42 42z m3 -28 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z"/>
<path d="M412 743 l3 -248 150 0 c134 1 154 3 191 22 90 48 98 170 14 219
l-30 18 28 29 c22 24 27 37 27 82 0 39 -5 59 -20 75 -37 42 -75 50 -225 50
l-140 0 2 -247z m276 151 c28 -19 29 -57 2 -84 -17 -17 -33 -20 -105 -20 l-85
0 0 60 0 60 83 0 c59 0 89 -5 105 -16z m1 -195 c52 -18 66 -64 31 -99 -17 -17
-33 -20 -120 -20 l-100 0 0 65 0 65 79 0 c43 0 92 -5 110 -11z"/>
<path d="M1135 873 c-11 -2 -34 -9 -51 -14 -31 -10 -32 -11 -21 -45 10 -34 12
-35 46 -28 92 21 161 0 161 -48 0 -18 -5 -19 -53 -13 -104 13 -184 -28 -193
-100 -12 -90 41 -138 143 -133 41 3 68 10 81 21 19 17 20 17 25 -3 4 -16 13
-20 47 -20 l41 0 -3 154 -3 155 -29 30 c-42 43 -117 61 -191 44z m137 -221
c14 -14 -2 -61 -25 -77 -25 -17 -89 -20 -118 -5 -19 11 -25 45 -11 66 16 24
49 34 96 30 27 -3 53 -9 58 -14z"/>
<path d="M1535 868 c-40 -14 -94 -65 -111 -105 -19 -44 -18 -127 2 -169 49
-103 191 -139 289 -73 40 28 42 35 15 64 l-20 22 -50 -25 c-43 -21 -53 -23
-84 -12 -50 16 -76 53 -76 106 0 56 17 92 51 110 39 20 78 17 118 -7 l34 -21
25 26 c22 22 24 27 11 42 -37 45 -137 65 -204 42z"/>
<path d="M2742 869 c-69 -20 -132 -114 -132 -195 1 -76 69 -159 148 -179 155
-41 287 86 247 237 -28 111 -144 171 -263 137z m144 -103 c29 -29 34 -41 34
-83 0 -58 -19 -90 -66 -109 -85 -35 -173 49 -150 142 4 15 20 39 36 55 42 43
100 41 146 -5z"/>
<path d="M3127 866 c-26 -7 -50 -15 -52 -18 -3 -3 0 -19 6 -37 11 -30 13 -31
48 -24 94 20 161 -1 161 -52 0 -21 -2 -21 -50 -11 -67 13 -135 -4 -172 -44
-40 -43 -39 -107 1 -152 24 -27 36 -32 89 -36 49 -3 68 0 96 16 33 20 34 20
39 1 4 -15 14 -19 46 -19 l41 0 0 138 c0 164 -11 195 -80 230 -50 25 -101 27
-173 8z m132 -202 c26 -5 31 -11 31 -35 0 -43 -34 -69 -91 -69 -54 0 -72 15
-67 57 5 44 53 61 127 47z"/>
<path d="M3594 861 c-18 -11 -39 -30 -48 -42 -16 -23 -16 -23 -16 14 l0 37
-45 0 -45 0 2 -187 3 -188 41 -3 42 -3 4 103 c5 138 28 176 113 190 17 3 20
11 20 48 0 37 -3 45 -20 48 -11 1 -34 -6 -51 -17z"/>
</g>
</svg>`
  };


  var imageReplacementParams = [
    ["Content Folder", svgIcons.folder],
    ["Item", svgIcons.document],
    ["Module Page", svgIcons.document],
    ["File", svgIcons.document],
    ["Assignment", svgIcons.assignment],
    ["Groups", svgIcons.group],
    ["Tools Area", svgIcons.tools],
    ["Course Link", svgIcons.link],
    ["linked item", svgIcons.minLink],
    ["Test", svgIcons.test],
    ["Web Link", svgIcons.extLink],
    ["Discussion Board", svgIcons.chat],
    ["Wikis", svgIcons.wiki],
    ["Blank Page", svgIcons.document],
    ["Piazza", svgIcons.extLink]
];



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
#settingsContainer_alerts, .breadcrumbs, .filterBarHorizontal #sortby,
.blogContainer li
{
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
.ui-dialog-buttonset button:last-child,
.threadButtons a:first-child,
.button-1, .button-3
{
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
.ui-dialog-buttonset button:last-child:hover,
.threadButtons a:first-child:hover,
.button-1:hover, .button-3:hover
{
  background-color: var(--primary-button-highlight) !important;
}

/* iframeButtonSecondary */
.fc-button-main:not(.fc-button-img), .genericButton,
.ui-dialog-buttonset button:first-child,
.threadButtons a:not(:first-child),
#msgAttachment_localBrowse, #msgAttachment_csBrowse, .button-2, .button-4
{
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
.fc-button-main:not(.fc-button-img):hover, .genericButton:hover, 
.ui-dialog-buttonset button:first-child:hover,
.threadButtons a:not(:first-child):hover,
#msgAttachment_localBrowse:hover, #msgAttachment_csBrowse:hover, .button-2:hover,
.button-4:hover
{
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
.stream_settings h5, .filterBarHorizontal #sortby,
.stream_item .stream_details, .stream_item .stream_item_highlight,
.stream_item .stream_user, .profileCardAvatarThumb
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
#streamDetailHeaderRight .timestamp, #dynamic_filters_alerts li a.active,
.blogContainer .commentDate, .blogContainer h5
{
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
#streamDetailHeaderRightClickable a, .profile-card a, .stream_item a, #gotocourseobjectlink,
.stream_item.active_stream_item .stream_details, .stream_item.active_stream_item .stream_item_highlight,
.stream_item.active_stream_item .stream_user,
#streamDetailRightColumn .detail-heading a, .comment-header
{
  color: var(--text-link) !important;
}

/* iframeTertiaryButtonHighlight */
.calendar-list .calendar-name label:hover, #filter_by_mygrades button:not(.active):hover
{
  color: var(--text-link) !important;
}

.blogContainer ul, .blogContainer li
{
  border-color: var(--background-main-outline) !important;
}

.left_stream_wrapper .stream_left, .left_stream_wrapper .scrollbar_track{
/*  height: calc(100% - 140px) !important;*/
  margin-bottom: 20px !important;
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
    color: var(--text-main) !important;
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

/*#streamDetailHeaderRight .context{
  display: none !important;
} */

#streamDetailHeaderRight{
  position: relative;
  margin-bottom: 10px !important;
  min-height: 0 !important;
}

/*#streamDetailHeaderRight .context ~ .timestamp{
  right: -3px !important;
  position: absolute;
  bottom: -10px;
  left: 10px;
}*/

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
  text-decoration: none !important;
  border-bottom: none !important;
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
  color: var(--text-main) !important;
}

.ui-dialog span{
  color: var(--text-main) !important;
}

.lb-wrapper .lb-content, .lb-wrapper .lb-content .content-lite {
    background-color: var(--background-main) !important;
    border-color: var(--background-main-outline) !important;
    color: var(--text-light) !important;
}

input[type="text"], input[type="password"], select {
  background-color: var(--background-main) !important;
  border-color: var(--background-main-outline) !important;
  color: var(--text-main) !important;
  border-style: solid !important;
  border-radius: 2px !important;
  border-width: 1px !important;
}

.submitStepBottom{
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  border: none !important;
}

.submitStepBottom:not(.submitStepFixed){
  background-color: transparent !important;
}

.submitStepFixed{
  background-color: var(--background-main-outline);
}

.stream_list_filter button{
  color: var(--text-light) !important;
  box-shadow: none !important;
}

.stream_list_filter button.active{
  color: var(--text-main) !important;
}

.filter-content-wrapper:before, .filter-content-wrapper:after{
  background-color: var(--background-main) !important;
  border-color: var(--background-main-outline) !important;
}

.stream_dynamic_filters{
  background-color: var(--background-main) !important;
  color: var(--text-main) !important;
  border-color: var(--background-main-outline) !important;
}

.blogContainer .entryText{
  color: var(--text-main) !important;
}

.entryFooter, .entryFooter>.u_controlsWrapper:first-child{
  background-color: var(--background-main) !important;
  color: var(--text-main) !important;
}

.addBlogComment textarea{
  background-color: var(--background-main) !important;
  color: var(--text-main) !important; 
  border-color: var(--background-main-outline) !important;
  padding: 5px;
  border-radius: 6px;
}

.addBlogComment{
  background-color: var(--background-main) !important;
  border: none !important;
}

.addBlogComment label, .dbThreadBody{
  color: var(--text-main) !important;
}

::-webkit-scrollbar {
  width: 7px;
}

::-webkit-scrollbar-track {
  background: var(--background-main);
}

::-webkit-scrollbar-thumb {
  background: var(--secondary-button);
  border-radius: 4px;
  opacity: 0.5;
}

.profileCardAvatarThumb img {
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  border-radius: 50% !important;
}

.profile-card-open-button{
  background-color: var(--background-main) !important;
}

`;

var inlineCSS = inlineCSSRoot + inlineCSSCont;
var toxCSS = inlineCSSRoot + toxCSSRoot;